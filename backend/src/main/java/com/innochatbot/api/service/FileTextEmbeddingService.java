package com.innochatbot.api.service;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileTextEmbeddingService {
	@Autowired
	ChunkService chunkService;
	private Map<String, TextExtractor> extractorMap = new HashMap<>();
	private TextExtractor fallbackExtractor; //TikaFallbackTextExtractor
	
	@Autowired
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

        // 청크 분할 + 저장
        if(text!= null || text != "") {
        	List<String> chunks = chunkService.split(text, 400);
            chunkService.saveChunks(fileId, chunks);
            System.out.println(extension + " 파일 임베딩 완료 : " + filePath);
        }else System.out.println(filePath + "처리할 청크 없음");

        
		/*
		if (extractor == null) {
			System.out.println("지원하지 않는 확장자 : " + extension);
			return;
		}
		if (extractor != null) {
			// 1) 확장자에 맞는 텍스트 추출기 실행
			String text = extractor.extract(filePath);
			
			// 2) 추출된 텍스트를 일정 길이 단위로 분할
			List<String> chunks = chunkService.split(text, 400);
			// 3) 분할된 청크를 DB에 저장
			chunkService.saveChunks(fileId, chunks);
			
			System.out.println(extension + " 파일 임베딩 완료 : " + filePath);
		}
		*/
	}

}
