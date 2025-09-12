package com.innochatbot.api.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.innochatbot.api.service.EmbeddingCliService;

/**
 * Spring Boot 애플리케이션 실행 직후 자동 실행되는 일괄처리 컴포넌트 1. docs 폴더 내 PDF 파일을 순회하며 2. 텍스트
 * 추출 → 청크 분할 → 임베딩 벡터 생성 3. DB의 chunk 테이블에 저장
 */
@Component
public class EmbeddingCli implements CommandLineRunner {
	
    @Autowired
    EmbeddingCliService embeddingCliService; 
    
    // application.properties 에서 값 가져옴 (값이 없으면 기본 false)
    @Value("${embedding.runOnStartup:false}")
    private boolean runOnStartup;

    //@Value("${embedding.docs.dir:D:/InnoBot_v3/docs}")
    //private String docsDir;
    
    
    @Override
    public void run(String... args) throws Exception { //파일경로 순회
    	embeddingCliService.EmbeddingCliService();
    	
    	/*
    	 // 플래그가 false면 바로 종료 -> 파일 순회 X
        if (!runOnStartup) {
            System.out.println("▶ EmbeddingCli: 시작 시 실행 비활성화 (embedding.runOnStartup=false)");
            return;
        }

        // 플래그가 true면 실제 작업 호출 -> 파일 순회 진행
        embeddingService.processAllDocs(Paths.get(docsDir));
    	 */
    }    
}
