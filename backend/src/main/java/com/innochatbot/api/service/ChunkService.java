package com.innochatbot.api.service;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.innochatbot.api.dto.ChunkDTO;
import com.innochatbot.api.mapper.ChunkMapper;
import com.innochatbot.api.utill.VectorUtils;

@Service
public class ChunkService {
	@Autowired
	private EmbeddingService embeddingService;
	@Autowired
	ChunkMapper chunkMapper;

	//청크 분할, 문자열을 지정 길이(size)로 분할하는 유틸 함수
	public List<String> split(String text, int size){
		List<String> result = new ArrayList<>();
		int pos = 0;
		while(pos < text.length()) {
			int end = Math.min(pos + size, text.length());
			result.add(text.substring(pos,end));
			pos = end;
		}
		return result;
	}
	
	//모든 청크 저장
	public void saveChunks(String fileId, List<String> chunks) {
		
		for(int i = 0; i <chunks.size(); i++) {
			float[] vec = embeddingService.embed(chunks.get(i));
			//L2 정규화 코드 사용
			if (!VectorUtils.l2NormalizeInPlaceBool(vec)) {
				System.out.println(fileId +"의 " + i +" 번째 텍스트 청크 정규화 실패");
				 vec = null;
			}
			chunkInsert(fileId, i + 1, chunks.get(i), vec);
		}
		System.out.printf("  • 처리 완료: %s (%d 청크)%n", fileId, chunks.size());
	}
	
	//fileName 임베딩
	public byte[] fileNameEmbedding(String fileName) {
		float[] vec = embeddingService.embed(fileName);
		if (!VectorUtils.l2NormalizeInPlaceBool(vec)) {
			System.out.println("파일 이름 임베딩 정규화 실패 : " + fileName);
		    //log.warn("embedding is zero or invalid, skip indexing. id={}", fileName);
		    return null;
		}
		byte[] bytes = VectorUtils.floatToBytesArray(vec);
		return bytes;
	}
	
	//chunkId 생성 및 값 부여
	private Long generateChunkId() {
		UUID uuid = UUID.randomUUID();
		Long chunkId = Math.abs(uuid.getMostSignificantBits()); 
		return chunkId;
	}
	
	// chunk 테이블에 임베딩된 청크 삽입
	private void chunkInsert(String fileId, int sequence, String content, float[] embedding) {
		Long chunkId = generateChunkId(); // 또는 UUID를 long으로 변환하거나 sequence 활용
		ChunkDTO dto = new ChunkDTO();
		
		
		dto.setChunkId(chunkId);
		dto.setFileId(fileId);
		dto.setSequence(sequence);
		dto.setContent(content); 
		if (embedding != null && embedding.length > 0) {
			dto.setEmbedding(VectorUtils.floatToBytesArray(embedding)); // float[] → byte[]
		}
		chunkMapper.chunkInsert(dto);
		
	}
	
	/*
	// float[] → byte[] 변환 (PostgreSQL pgvector용, LE 방식)
	private byte[] toBytes(float[] vec) {
		ByteBuffer buffer = ByteBuffer.allocate(vec.length * 4);
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		for(float v : vec) buffer.putFloat(v);
		return buffer.array();
		
	}
	*/
	
	//추가 검증 / 체크 함수(디버깅용)
	// norm 구하는 유틸 (검증용)
	/*
	public static double l2Norm(float[] v) {
	    if (v == null) return 0.0;
	    double sum = 0.0;
	    for (float x : v) sum += (double)x * x;
	    return Math.sqrt(sum);
	}

	// 저장 직후 검증 (예시)
	public void verifySavedEmbedding(String id) {
	    byte[] b = chunkMapper.selectEmbeddingByChunkId(id); // 예시
	    if (b == null) {
	        System.out.println("저장된 임베딩 없음: " + id);
	        return;
	    }
	    float[] v = VectorUtils.bytesToFloatArray(b, ByteOrder.LITTLE_ENDIAN);
	    System.out.println("loaded norm = " + l2Norm(v));
	    System.out.println("loaded len = " + v.length);
	}
	*/
}
