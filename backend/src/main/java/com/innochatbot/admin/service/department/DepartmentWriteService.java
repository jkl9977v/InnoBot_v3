package com.innochatbot.admin.service.department;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.DepartmentMapper;

@Service
public class DepartmentWriteService {
	@Autowired
	DepartmentMapper departmentMapper;

	public void departmentWrite(DepartmentCommand departmentCommand) {
		DepartmentDTO dto = new DepartmentDTO();
		
		dto.setDepartmentId(departmentCommand.getDepartmentId());
		dto.setDepartmentName(departmentCommand.getDepartmentName());
		
		departmentMapper.departmentInsert(dto);
	}

}
