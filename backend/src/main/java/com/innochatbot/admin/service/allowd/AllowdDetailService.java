package com.innochatbot.admin.service.allowd;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.AllowdMapper;

@Service
public class AllowdDetailService {
	@Autowired
	AllowdMapper allowdMapper;

	public void allowdDetail(String allowdId, Model model) {
		//List<DepartmentDTO> list = departmentMapper.allowdDetail(allowdId);
		List<DepartmentDTO> list = allowdMapper.allowdDetail(allowdId);
		model.addAttribute("list", list);
		
	}
}
