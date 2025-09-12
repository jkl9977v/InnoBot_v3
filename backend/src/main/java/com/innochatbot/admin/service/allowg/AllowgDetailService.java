package com.innochatbot.admin.service.allowg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.mapper.AllowgMapper;

@Service
public class AllowgDetailService {
	@Autowired
	AllowgMapper allowgMapper;

	public void allowgDetail(String allowgId, Model model) {
		GradeDTO dto = allowgMapper.allowgDetail(allowgId);
		model.addAttribute("dto", dto);
	}
}
