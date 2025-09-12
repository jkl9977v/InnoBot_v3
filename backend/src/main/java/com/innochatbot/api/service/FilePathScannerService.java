package com.innochatbot.api.service;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.dto.FilePathDTO;
import com.innochatbot.admin.mapper.FilePathMapper;
import com.innochatbot.admin.service.AutoNumService;

@Service
public class FilePathScannerService {
	@Autowired
	FilePathMapper filePathMapper;
	@Autowired
	AutoNumService autoNumService;

	public void processFilePath(Path startPath, String path, String parentPath, int depth) {
		String pathId = filePathMapper.pathIdSelect(path);
		String parentId = filePathMapper.pathIdSelect(parentPath);
		if (pathId == null) { //새로 생긴 경로
			String sep ="path_";
            String column = "path_id";
            int len = 6;
            String table = "file_path";
            pathId = autoNumService.autoNum1(sep, column, len, table); //새 PathId 생성
            
            FilePathDTO dto = new FilePathDTO();
            
            dto.setPathId(pathId); 
            dto.setPath(path);
            dto.setParentId(parentId);
            dto.setDepth(depth);
             
            filePathMapper.filePathInsert(dto);   
			
		}
		
	}

}
