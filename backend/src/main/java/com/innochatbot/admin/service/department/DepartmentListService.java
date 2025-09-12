package com.innochatbot.admin.service.department;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.mapper.DepartmentMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class DepartmentListService {

	@Autowired
	DepartmentMapper departmentMapper;
	@Autowired
	ListPageService listPageService;

	public void departmentList(int page, int limitPage, String searchWord, String kind, Model model) {
		//1. 
		StartEndPageDTO dto = listPageService.StartEndRow(page, limitPage, null, searchWord, kind, null);
		
		Integer count = departmentMapper.departmentCount();
		
		List<DepartmentDTO> list = departmentMapper.departmentList(dto);
		System.out.println(dto);
		System.out.println(list);
		
		listPageService.ShowList(page, limitPage, count, searchWord, list, model, null, kind);
		
	}
}
