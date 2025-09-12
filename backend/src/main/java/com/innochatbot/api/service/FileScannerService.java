package com.innochatbot.api.service;

import java.nio.file.Path;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.dto.FileDTO;
import com.innochatbot.admin.mapper.FilePathMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.api.mapper.ChunkMapper;
import com.innochatbot.api.mapper.FileMapper;
import com.innochatbot.api.utill.FileHashUtill;

@Service
public class FileScannerService {

	@Autowired
	FilePathMapper filePathMapper;
	@Autowired
	FileMapper fileMapper;
	@Autowired
	AutoNumService autoNumService;
	@Autowired
	FileTextEmbeddingService fileTextEmbeddingService;
	@Autowired
	ChunkMapper chunkMapper;
	@Autowired
	ChunkService chunkService;
	@Autowired
	EmbeddingService embeddingService;
	
	
	public FileScannerService(ChunkService chunkService
			, EmbeddingService embeddingService) {
		this.chunkService = chunkService;
		this.embeddingService = embeddingService;
	}
	
	//개별 파일 처리 함수
	public void processFile(String fileName, String filePath, Path parentPath
			, Date updateTime, long size, Path currentPath) {
        System.out.println("처리대상 파일: " + filePath);
        System.out.println("파일명: " + fileName);

		try {
			//현재 파일 Id 조회
			String fileId = getFileId(fileName, currentPath);
			//현재 파일 hash 계산
			String currentHash = FileHashUtill.getMD5(currentPath);
			//PathId 조회
			String pathId = getPathId(parentPath);
			//System.out.println("PathId: " + pathId);
			//extension 확장자 추출
			String extension = "";
			int dotIndex = fileName.lastIndexOf('.');
			if (dotIndex != -1 && dotIndex <fileName.length() -1) {
				extension = fileName.substring(dotIndex + 1); //확장자만 추출
			}
			
			if (fileId != null) {
				//기존 파일 hash 계산 
				String oldHash = fileHashSelect(fileId);
				if (currentHash.equals(oldHash)) {
		            System.out.println("파일 변경 없음 -> 생략: " + fileName);
		            return;
				} else if (!currentHash.equals(oldHash)) {
					fileMapper.fileHashUpdate(currentHash, fileId); 
					
					//기존 Chunk삭제
					chunkMapper.chunkDelete(fileId);
					fileTextEmbeddingService.contentEmbedding(currentPath, extension, fileId);
				}
			} else if (fileId == null) { // 1. file_id가 null일때 : file 이번에 감지함   		
	            fileId = fileWrite(fileName, currentHash, extension, pathId, size, updateTime); //파일테이블 작성
	            
	            fileTextEmbeddingService.contentEmbedding(currentPath, extension, fileId); 
	                
			}
		} catch (Exception e) {
			e.printStackTrace(); 
		}
    }
	
	private String fileWrite(String fileName, String currentHash
			, String extension, String pathId
			, long size, Date updateTime) { //파일 작성
        String sep ="file_"; 
        String column = "file_id";
        int len = 6;
        String table = "file";
        int zeroLen = 10;
        String fileId = autoNumService.autoNum2(sep, column, len, table , zeroLen);
        byte[] embedding ;
        //파일 이름에 대한 텍스트 임베딩
        if(fileName != null && fileName != "") {
        	embedding = chunkService.fileNameEmbedding(fileName);
        } else {
        	embedding = null;
        }
          
        //file에 대한 insert 부분 만들기 
        FileDTO dto = new FileDTO(); 
            
        dto.setFileId(fileId);
        dto.setFileName(fileName);
        dto.setHash(currentHash);
        dto.setExtension(extension);
        dto.setPathId(pathId);
        dto.setSize(size);
        dto.setUpdateTime(updateTime); 
        dto.setEmbedding(embedding);
            
        fileMapper.fileInsert(dto);
        System.out.println(fileName + " 파일 테이블 입력 완료");
        
        return fileId;
	}
	
	private String getPathId(Path parentPath) {
		String path = parentPath.toAbsolutePath().toString().replace("\\", "/");
		//System.out.println("PathId 조회, path = " + path);
		String pathId = filePathMapper.pathIdSelect(path);
		if (pathId == null ) {
			return pathId = null;
		}
		else return pathId;
	}

	//파일명 + 경로기반 file_id 조회
	private String getFileId(String fileName, Path currentPath) {
		String fullPath = currentPath.toAbsolutePath().toString().replace("\\", "/"); //Windows 경로 처리
		String path = fullPath.replace("/" + fileName, "");
			
		String fileId = fileMapper.fileIdSelect(fileName, path);
		if (fileId == null) {
			fileId = null;
		}
		return fileId;
	}
	        
	//DB에서 기존 해시 조회
	public String fileHashSelect(String fileId) {
	    String hash = fileMapper.filehashSelect(fileId);
	    if(hash != null) {
	    	return hash;
	    }else return null;
	}

}
