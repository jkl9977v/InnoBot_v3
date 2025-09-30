package com.innochatbot.admin.service.filePath;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.FilePathCommand;
import com.innochatbot.admin.dto.FilePathDTO;
import com.innochatbot.admin.mapper.FilePathMapper;

@Service
public class FilePathUpdateService {

    @Autowired
    FilePathMapper filePathMapper;

    public Boolean pathUpdate(FilePathCommand filePathCommand) {
    	int updateResult = 0;
    	
        FilePathDTO dto = new FilePathDTO();

        dto.setPathId(filePathCommand.getPathId());
        dto.setPath(filePathCommand.getPath());
        dto.setAccessId(filePathCommand.getAccessId());
        updateResult = filePathMapper.filePathUpdate(dto);
        
        return updateResult == 1;
    }

}
