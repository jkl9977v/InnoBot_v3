package com.innochatbot.admin.service.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.dto.UserDTO;
import com.innochatbot.admin.mapper.DepartmentMapper;
import com.innochatbot.admin.mapper.GradeMapper;
import com.innochatbot.admin.mapper.UserMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class UserListService {
	@Autowired
	UserMapper userMapper;
	@Autowired
	ListPageService listPageService;
	@Autowired
	DepartmentMapper departmentMapper;
	@Autowired
	GradeMapper gradeMapper;

	public void userList(int page, int limitRow, String searchWord, String kind, Model model, String kind2) {
		//1.
		StartEndPageDTO dto = listPageService.StartEndRow(page, limitRow, null, searchWord, kind, kind2);
		
		//2.
		Integer count = userMapper.userCount();
		
		//3.
		List<UserDTO> list = userMapper.userList(dto);
		
		//4. 
		listPageService.ShowList(page, limitRow, count, searchWord, list, model, null, kind);
		
		List<DepartmentDTO> department = departmentMapper.departmentList(null);
		model.addAttribute("department", department);
		
		List<GradeDTO> grade = gradeMapper.gradeList(null,null);
		model.addAttribute("grade", grade);
		model.addAttribute("kind2", kind2);
		
	}

}
