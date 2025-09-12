package com.innochatbot.api.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.api.dto.TopChunk;
import com.innochatbot.api.dto.TopFile;
import com.innochatbot.api.mapper.ChatMapper;
import com.innochatbot.api.utill.VectorUtils;

@Service
public class TopSearchService { //유사도 검색 서비스
	@Autowired
	ChatMapper chatMapper;
	@Autowired
	EmbeddingService embeddingService;
	
	//1. chunk만 유사도 검색
	 /**
     * [방법1] 청크 임베딩만 사용한 Top-K 검색.
     *
     * 흐름:
     *  1) 사용자 질문을 임베딩하여 queryVec 생성
     *  2) DB에서 후보 청크 N개(row) 조회 (embedding은 byte[])
     *  3) 각 row의 embedding(byte[]) → float[] 복원
     *  4) queryVec vs chunkVec 코사인 유사도 계산
     *  5) 우선순위 큐(min-heap)로 Top-K 유지
     *  6) 최종적으로 점수 내림차순 정렬하여 반환
     *
     * @param query           사용자 질문(텍스트)
     * @param chunkLimit  DB에서 가져올 후보 청크 수(예: 1000)
     * @param topK            최종 상위 결과 수(예: 5)
     */
    public List<TopChunk> topChunkEmbedding(float[] queryVec, int chunkLimit, int topK) {
		//0. 질문 L2 정규화 작업
		VectorUtils.l2NormalizeInPlace(queryVec);

        // 2) DB에서 후보 청크 가져오기 (embedding은 byte[])
        List<Map<String, Object>> rows = chatMapper.chunkEmbeddingOnlySelect(chunkLimit);

        // 3) 후보 순회하며 코사인 유사도 계산 → Top‑K 유지 (작은 값이 먼저 나오는 min-heap)
        //  min-heap (작은 점수 우선)으로 Top-K 유지
        PriorityQueue<TopChunk> heap =
                new PriorityQueue<>(Comparator.comparingDouble(TopChunk::score));
        
        // 4) 모든 후보에 대해 유사도 계산
        for (Map<String, Object> row : rows) {
            Long chunkId = ((Number) row.get("chunk_id")).longValue();
            String fileId  = String.valueOf(row.get("file_id"));
            String content = (String) row.get("content");
            byte[] embBytes = (byte[]) row.get("embedding");

            if (embBytes == null || embBytes.length == 0) continue; //방어

            // byte[] → float[]  ===> 이게 chunkVec
            float[] chunkVec = VectorUtils.bytesToFloatArray(embBytes);

            // (선택) 저장 시 정규화 안 했다면 여기서 정규화 가능
            // VectorUtils.l2NormalizeInPlace(chunkVec);

            // 5) 코사인 유사도 계산 (정규화 했다면 dot도 가능)
            //double score = VectorUtils.cosine(queryVec, chunkVec);
            double score = VectorUtils.dot(queryVec, chunkVec); // 둘 다 정규화되어 있으면 동일
            
            // 5-1) 최소 점수 필터 : 낮으면 스킵 (임계치)
            //if (score < minScore) continue;

            // 6) Top‑K 유지
            if (heap.size() < topK) {
                heap.add(new TopChunk(chunkId, fileId, content, score));
            } else if (score > heap.peek().score()) {
                heap.poll(); //최솟값 제거
                heap.add(new TopChunk(chunkId, fileId, content, score)); 
            }
        }

        // 7) 최종 결과: 점수 내림차순으로 정렬하여 반환
        List<TopChunk> result = new ArrayList<>(heap);
        result.sort((a, b) -> Double.compare(b.score(), a.score()));
        return result;
    }

    
	//2. file과 chunk 동시에 유사도 검색
    /**
     * [방법2] 파일 제목/청크 임베딩을 동시에 고려하는 가중합 Top-K.
     *
     * 흐름:
     *  1) join 쿼리로 file.title_embedding + chunk.embedding 한 번에 조회
     *  2) qvec vs titleVec → st (제목 점수), qvec vs chunkVec → sc (내용 점수)
     *  3) score = wTitle * st + wChunk * sc
     *  4) 우선순위 큐로 Top-K 유지 → 반환
     *
     * @param qvec   질문 임베딩(float[]) — 이미 외부에서 생성해 전달
     * @param wTitle 제목 가중치 (예: 0.3)
     * @param wChunk 내용 가중치 (예: 0.7)
     * @param K      Top-K 개수
     */
    public List<TopChunk> topFileChunkEmbedding(float[] queryVec, double wTitle, double wChunk, int topK) {
		//0. 질문 L2 정규화 작업
		VectorUtils.l2NormalizeInPlace(queryVec);
		
    	// 1) 제목/청크 임베딩 모두 포함한 row 조회 (파일×청크 join)
        List<Map<String, Object>> rows = chatMapper.fileAndChunkEmbeddingSelect();
        // 2) Top-K 유지용 min-heap
        PriorityQueue<TopChunk> K = new PriorityQueue<>(Comparator.comparingDouble(c -> c.score()));
        
        // 3) 각 row에 대해 가중합 점수 계산
        for (Map<String, Object> row : rows) {
            float[] titleVec = VectorUtils.bytesToFloatArray((byte[]) row.get("embedding"));
            float[] chunkVec = VectorUtils.bytesToFloatArray((byte[]) row.get("embedding"));

            //double st = VectorUtils.cosine(queryVec, titleVec); //제목 유사도
            //double sc = VectorUtils.cosine(queryVec, chunkVec); //내용 유사도
            
            // 정규화 시 dot
            double st = VectorUtils.dot(queryVec, titleVec); //제목 유사도
            double sc = VectorUtils.dot(queryVec, chunkVec); //내용 유사도
            
            double score = wTitle * st + wChunk * sc; //가중할 스코어
            
            //최소 점수 필터 : 낮으면 스킵 (임계치)
            //if (score < minScore) continue;

            TopChunk topChunk = new TopChunk(
                ((Number) row.get("chunk_id")).longValue(),
                (String) row.get("file_id"),
                (String) row.get("content"),
                score
            );

            if (K.size() < topK) {
                K.add(topChunk);
            } else if (score > K.peek().score()) {
                K.poll();
                K.add(topChunk);
            }
        }
        
        // 4) 최종 결과를 점수 내림차순으로 정렬하여 반환
        return K.stream()
                .sorted((a, b) -> Double.compare(b.score(), a.score()))
                .toList();
    }
	
    
	//3. file -> chunk 순서로 유사도 검색
    /**
     * [방법3] 파일 제목 Top-M → 해당 파일 청크에서 Top-K (권장).
     *
     * 흐름:
     *  1) 파일 테이블에서 title_embedding만 조회
     *  2) qvec vs titleVec 코사인 → Top-M 파일 선별
     *  3) 선별된 파일들의 청크 임베딩 조회
     *  4) qvec vs chunkVec 코사인 → Top-K 청크 선별
     *  5) 결과 반환
     *
     * @param qvec 질문 임베딩(float[])
     * @param M    제목 1차 후보 개수 (예: 20~50)
     * @param K    최종 청크 Top-K (예: 5)
     */
	public List<TopChunk> topFileChunk(float[] queryVec, int topM, int topK){
		//0. 질문 L2 정규화 작업
		VectorUtils.l2NormalizeInPlace(queryVec);
		
		// ===== 1단계: 파일 제목 임베딩 조회 =====
		//1-1) 제목 임베딩 조회
		List<Map<String, Object>> fileRows = chatMapper.fileNameEmbeddingSelect1();
		//1-2) Top-M 유지를 위한 min-heap
		PriorityQueue<TopFile> M = new PriorityQueue<>(Comparator.comparingDouble(f -> f.score()));
		//1-3) 모든 파일 제목 임베딩에 대해 유사도 계산
		for (Map<String, Object> row : fileRows ) {
			float[] titleVec = VectorUtils.bytesToFloatArray((byte[]) row.get("embedding"));
			
			//double score = VectorUtils.cosine(queryVec, titleVec);
			double score = VectorUtils.dot(queryVec, titleVec);
			
			TopFile topFile = new TopFile(
				(String) row.get("file_id"),
				(String) row.get("file_name"),
				score
			);
			
			if(M.size() < topM) {
				M.add(topFile);
			}else if (score > M.peek().score()) {
				M.poll();
				M.add(topFile);
			}
			
		}
		
		//1-4) 점수 내림차순 정렬 후 file_id 리스트 추출 → 2단계의 IN 절 파라미터로 사용
		List<String> candidateFileIds = M.stream()
				.sorted((a,b) -> Double.compare(b.score(), a.score()))
				.map(TopFile::fileId)
				.toList();
		
		
		// ===== 2단계: 후보 파일들의 청크 임베딩 조회 =====
		//2-1) 후보 파일의 청크 임베딩 조회
		List<Map<String, Object>> chunkRows = chatMapper.chunkEmbeddingSelect2(candidateFileIds);
		//2-2) Top-K 유지를 위한 min-heap
		PriorityQueue<TopChunk> K = new PriorityQueue<>(Comparator.comparingDouble(c->c.score()));
		//2-3) file_id 리스트 중 chunk임베딩에 대해 유사도 계산
		for(Map<String, Object> row : chunkRows) {
			float[] chunkVec = VectorUtils.bytesToFloatArray((byte[]) row.get("embedding"));
			
			//double score = VectorUtils.cosine(queryVec, chunkVec);
			double score = VectorUtils.dot(queryVec, chunkVec);
			
            //최소 점수 필터 : 낮으면 스킵 (임계치)
            //if (score < minScore) continue;
			
			TopChunk topChunk = new TopChunk(
				((Number) row.get("chunk_id")).longValue(),
				(String) row.get("file_id"),
				(String) row.get("content"),
				score
				
			);
			
			if(K.size() < topK) {
				K.add(topChunk);
			} else if (score > K.peek().score()) {
				K.poll();
				K.add(topChunk);
			}
		}
		//2-4) 최종 결과 반환 (점수 내림차순)
		return K.stream()
				.sorted((a,b) -> Double.compare(b.score(), a.score()))
				.toList();
	}
	

    
}
