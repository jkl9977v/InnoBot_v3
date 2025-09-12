package com.innochatbot.admin.service.grade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.mapper.GradeMapper;

@Service
public class GradeDetailService {
	@Autowired
	GradeMapper gradeMapper;

	public void gradeDetail(String gradeId, Model model) {
		GradeDTO dto = gradeMapper.gradeDetail(gradeId);
		model.addAttribute("dto", dto);
	}
	
}
