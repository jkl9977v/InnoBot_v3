package com.innochatbot.api.service;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.config.PreprocessConfig;

@Service
public class FileTextEmbeddingService {
	@Autowired
	ChunkService chunkService;
	private Map<String, TextExtractor> extractorMap = new HashMap<>();
	private TextExtractor fallbackExtractor; //TikaFallbackTextExtractor
	@Autowired
	private TextCleanerService textCleanerService; //textCleanerService;
	@Autowired
	private PreprocessConfig preprocessConfig;
	

	// 생성자 주입을 통해 모든 TextExtractor 구현체를 받아옴
	public FileTextEmbeddingService(List<TextExtractor> extractors, ChunkService chunkService) {
		this.chunkService = chunkService;
		
		//확장자가 있는 Extractor만 Map에 등록 (pdf, txt, docx 등)
		this.extractorMap = extractors.stream()
				.filter( e ->  e.getExtension() != null && !e.getExtension().isBlank()
				).collect(Collectors.toMap(
						e -> e.getExtension().toLowerCase(),
						e -> e
				));
		
		//확장자가 비어있는 Extractor → fallback 용도로 지정 (예: TikaFallbackTextExtractor)
		this.fallbackExtractor = extractors.stream()
				.filter( e -> e.getExtension() == null || e.getExtension().isBlank()
				)
				.findFirst()
				.orElse(null);
		
        // 디버그 로그: 어떤 extractors가 등록됐는지 한 번 찍어두면 문제 찾기 쉬움
        System.out.println("[FileTextEmbeddingService] registered extractors: " + extractorMap.keySet()
            + ", fallback present: " + (fallbackExtractor != null));
	}
	
	/**
     * 파일 내용을 임베딩하는 메서드
     * @param filePath   파일 경로
     * @param extension  파일 확장자 (예: "pdf", "txt")
     * @param fileId     DB에 저장된 file_id
     */
	public void contentEmbedding(Path filePath, String extension, String fileId) throws Exception {
		if (extension == null) extension = "";
		extension = extension.toLowerCase(); //확장자 소문자로 통일
		TextExtractor extractor = extractorMap.getOrDefault(extension,fallbackExtractor);
		
        // 텍스트 추출
        String text = extractor.extract(filePath);
        
        // ++ 전처리 추가 (clean, split, dedupe)
        if(preprocessConfig.isEnable()) {
        	text = textCleanerService.clean(text); //1. 불필요한 문자 제거
        	List<String> sentences = textCleanerService.split(text); //2. 문장 단위로 분리
        	
        	int before = sentences.size(); //중복 제거 전 개수 기록
        	
        	//System.out.println(sentences);
        	if(preprocessConfig.isDedupe()) { //3. 중복 제거
        		
        		
        		sentences = textCleanerService.removeDuplicates(sentences);
        		
        		int after = sentences.size(); // 중복 제거 후 개수 리고
        		
        		System.out.printf("[3단계] 중복 제거: %d → %d (%d개 제거, %.1f%% 감소)%n",
                        before, after, before - after, 
                        100.0 * (before - after) / Math.max(1, before));
        	}
        	
        	//다시 하나의 텍스트로 합치기 (청크 분할을 위해)
        	text = String.join("\n", sentences);
        }
         

        // 청크 분할 + 저장
        if(text!= null || text != "") {
        	List<String> chunks = chunkService.split(text, 400);
            //chunkService.saveChunks(fileId, chunks);
            System.out.println(extension + " 파일 임베딩 완료 : " + filePath);
        }else System.out.println(filePath + "처리할 청크 없음");

	}

}
