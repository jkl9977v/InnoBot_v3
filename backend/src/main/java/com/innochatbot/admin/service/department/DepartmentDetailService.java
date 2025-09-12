package com.innochatbot.admin.service.department;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.DepartmentMapper;

@Service
public class DepartmentDetailService {
	@Autowired
	DepartmentMapper departmentMapper;

	public void departmentDetail(String departmentId, Model model) {
		DepartmentDTO dto = departmentMapper.departmentDetail(departmentId);
		model.addAttribute("dto", dto);
	}
}
