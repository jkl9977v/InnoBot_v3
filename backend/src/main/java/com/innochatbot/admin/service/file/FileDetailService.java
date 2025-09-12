package com.innochatbot.admin.service.file;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.FileDTO;
import com.innochatbot.api.mapper.FileMapper;

@Service
public class FileDetailService {
	@Autowired
	FileMapper fileMapper;

	public void fileDetail(String fileId, Model model) {
		FileDTO dto = fileMapper.fileDetail(fileId);
		System.out.println("파일 상세정보: " +dto);
		model.addAttribute("dto", dto);
	}

}
