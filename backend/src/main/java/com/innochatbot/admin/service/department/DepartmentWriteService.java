package com.innochatbot.admin.service.department;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.DepartmentMapper;
import com.innochatbot.admin.service.AutoNumService;

@Service
public class DepartmentWriteService {
	@Autowired
	DepartmentMapper departmentMapper;
	@Autowired
	AutoNumService autoNumService;

	public Boolean departmentWrite(DepartmentCommand departmentCommand) {
		String sep = "dep_";
		String column = "department_id";
		int len = 5;
		String table = "department";
		
		String departmentId = autoNumService.autoNum1(sep, column, len, table);
		
		int insertResult = 0;
		DepartmentDTO dto = new DepartmentDTO();
		
		dto.setDepartmentId(departmentId);
		dto.setDepartmentName(departmentCommand.getDepartmentName());
		
		insertResult = departmentMapper.departmentInsert(dto);
		
		return insertResult == 1;
	}

}
