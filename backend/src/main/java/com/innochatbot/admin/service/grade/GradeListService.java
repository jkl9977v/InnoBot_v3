package com.innochatbot.admin.service.grade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.mapper.GradeMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class GradeListService {
	@Autowired
	GradeMapper gradeMapper;
	@Autowired
	ListPageService listPageService;
	
	public void gradeList(int page, int limitRow, String searchWord, String kind, Model model) {
		//1. 
		StartEndPageDTO dto = listPageService.StartEndRow(page, limitRow, null, searchWord, kind , null);
		
		//2.
		Integer count = gradeMapper.gradeCount(null);
		
		//3. 
		List<GradeDTO> list = gradeMapper.gradeList(dto, null);
		System.out.println(dto);
		
		//4. 
		listPageService.ShowList(page, limitRow, count, searchWord, list, model, null, kind);
	}

}
