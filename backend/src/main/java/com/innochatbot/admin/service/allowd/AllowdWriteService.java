package com.innochatbot.admin.service.allowd;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.AllowdMapper;
import com.innochatbot.admin.service.AutoNumService;

@Service
//@Transactional
public class AllowdWriteService {
	@Autowired
	AllowdMapper allowdMapper;
	@Autowired
	AutoNumService autoNumService;

	public Boolean allowdWrite(DepartmentCommand departmentCommand
			, List<String> departmentIds) {
		String sep = "allowd_";
		String column = "allowd_id";
		int len = 8;
		String table = "allowd_departments";
		
		String allowdId = autoNumService.autoNum1(sep, column, len, table);
		
		int insertResult = 0;
		
		for(String departmentId1 : departmentIds) {
			DepartmentDTO dto = new DepartmentDTO();
			
			dto.setAllowdId(allowdId);
			dto.setAllowdName(departmentCommand.getAllowdName());
			dto.setDepartmentId(departmentId1);
			allowdMapper.allowdInsert(dto);
			
			insertResult += 1;
			
			//System.out.println("AllowDept Insert: "+departmentId1);
		}
		return insertResult == departmentIds.size();
	}

	public Boolean allowdWrite2(DepartmentCommand departmentCommand) {
		String sep = "allowd_";
		String column = "allowd_id";
		int len = 8;
		String table = "allow_departments";
		
		String allowdId = autoNumService.autoNum1(sep, column, len, table);
		
		int insertResult = 0;
		
		
		for(String departmentId1 : departmentCommand.getDepartmentIds()) {
			DepartmentDTO dto = new DepartmentDTO();
			
			dto.setAllowdId(allowdId);
			dto.setAllowdName(departmentCommand.getAllowdName());
			dto.setDepartmentId(departmentId1);
			allowdMapper.allowdInsert(dto);
			
			insertResult += 1;
			
			//System.out.println("AllowDept Insert: "+departmentId1);
		}
		return insertResult == departmentCommand.getDepartmentIds().size();
	}
}
