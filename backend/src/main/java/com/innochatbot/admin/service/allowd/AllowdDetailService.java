package com.innochatbot.admin.service.allowd;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.AllowdMapper;

@Service
public class AllowdDetailService {
	@Autowired
	AllowdMapper allowdMapper;

	public List<DepartmentDTO> allowdDetail(String allowdId) {
		//List<DepartmentDTO> list = departmentMapper.allowdDetail(allowdId);
		List<DepartmentDTO> list = allowdMapper.allowdDetail(allowdId);
		
		System.out.println(list);
		return list;
	}
}
