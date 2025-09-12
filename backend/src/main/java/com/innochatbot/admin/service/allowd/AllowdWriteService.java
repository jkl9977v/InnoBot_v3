package com.innochatbot.admin.service.allowd;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.AllowdMapper;

@Service
//@Transactional
public class AllowdWriteService {
	@Autowired
	AllowdMapper allowdMapper;

	public void allowdWrite(DepartmentCommand departmentCommand
			, List<String> departmentIds) {
		for(String departmentId1 : departmentIds) {
			DepartmentDTO dto = new DepartmentDTO();
			
			dto.setAllowdId(departmentCommand.getAllowdId());
			dto.setAllowdName(departmentCommand.getAllowdName());
			dto.setDepartmentId(departmentId1);
			allowdMapper.allowdInsert(dto);
			
			System.out.println("AllowDept Insert: "+departmentId1);
		}
	}
}
