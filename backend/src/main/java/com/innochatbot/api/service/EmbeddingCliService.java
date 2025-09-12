package com.innochatbot.api.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.innochatbot.admin.dto.ChatbotDTO;
import com.innochatbot.admin.service.chatBot.ChatbotDetailService;
import com.innochatbot.api.mapper.FileMapper;

/**
 * Spring Boot 애플리케이션 실행 직후 자동 실행되는 일괄처리 컴포넌트 1. docs 폴더 내 PDF 파일을 순회하며 2. 텍스트
 * 추출 → 청크 분할 → 임베딩 벡터 생성 3. DB의 chunk 테이블에 저장
 */
@Service
public class EmbeddingCliService {// 텍스트 임베딩 기능을 수행한다.
    //PDF파일을 읽고, 400자 단위로 나눈 다음, OpenAI 임베딩 벡터를 생성하고, chunk테이블에 저장하는 일괄처리(batch)파일

    @Value("${openai.api.key}")         // application.properties 또는 .env에서 API 키 주입
    private String apiKey;
    
    @Autowired
    FileMapper fileMapper;
    
    @Autowired
    private FilePathScannerService filePathScannerService;
    
    @Autowired
    private FileScannerService fileScannerService;
    
    @Autowired
    ChatbotDetailService chatbotDetailService;
    
    
    public void EmbeddingCliService() throws Exception { //파일경로 순회
        System.out.println("▶ EmbeddingCli 시작");
        
        ChatbotDTO dto = chatbotDetailService.returnDTO();

        // 1. docs 폴더 내 파일 순회 => 전체 파일 순회
        Path startPath = Paths.get(dto.getPath());
        System.out.println("시작경로 : " + dto.getPath());
        
        Files.walk(startPath)
        		.forEach(currentPath -> {
        			if(Files.isDirectory(currentPath)) { // 디렉토리일 때
        				String path = currentPath.toAbsolutePath().toString().replace("\\", "/");
        				System.out.println();
        				String parentPath;
        				//계층 깊이 (depth) = 현재 경로 깊이 (currentDepth) - 기준 경로 깊이 (baseDepth) 
        				int baseDepth = startPath.getNameCount();
        				int currentDepth = currentPath.getNameCount();
        				int depth = currentDepth - baseDepth;
        				System.out.println("현재 경로 : " + path + " / 디렉토리 depth: " + depth);
        				
        				if (currentPath.equals(startPath)) {
        					parentPath = null;
        				}else {
        					parentPath = currentPath.getParent().toString().replace("\\", "/");
        				}
        				// 추후 더 필요한거 있으면 추가
        				filePathScannerService.processFilePath(startPath, path, parentPath, depth);
        			}else { //파일일 때
        				String fileName = currentPath.getFileName().toString();
        				String filePath = currentPath.toAbsolutePath().toString().replace("\\", "/");
        				Path parentPath = currentPath.getParent();
        				Date updateTime = null;
        				long size = 0;
						try {
							updateTime = new Date(
									Files.getLastModifiedTime(currentPath).toMillis());
							size = Files.size(currentPath);
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						fileScannerService.processFile(fileName, filePath, parentPath, updateTime, size, currentPath);
        			}
        		});
        System.out.println("▶ EmbeddingCli 완료");
    }  
}
