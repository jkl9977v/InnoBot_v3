package com.innochatbot.admin.service.filePath;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import com.innochatbot.admin.dto.AccessRuleDTO;
import com.innochatbot.admin.dto.FilePathDTO;
import com.innochatbot.admin.mapper.AccessRuleMapper;
import com.innochatbot.admin.mapper.FilePathMapper;

@Service
public class FilePathDetailService {

    @Autowired
    FilePathMapper filePathMapper;
    @Autowired
    AccessRuleMapper accessRuleMapper;

    public void pathDetail(String pathId, Model model) {
    	System.out.println(pathId);
        FilePathDTO dto = filePathMapper.filePathDetail(pathId);
        AccessRuleDTO dto2 = accessRuleMapper.accessRuleDetail(dto.getAccessId());
        model.addAttribute("dto", dto);
        model.addAttribute("dto2", dto2);
        
    }

	public Map<String, String> pathDetail2(String pathId) {
		
		return null;
	}
}
