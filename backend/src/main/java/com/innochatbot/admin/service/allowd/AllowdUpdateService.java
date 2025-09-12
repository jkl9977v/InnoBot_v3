package com.innochatbot.admin.service.allowd;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.AllowdMapper;

@Service
public class AllowdUpdateService {
	@Autowired
	AllowdMapper allowdMapper;

	public void allowdUpdate(DepartmentCommand departmentCommand
			, List<String> departmentId) {
		//기존 규칙 삭제
		String allowdId=departmentCommand.getAllowdId();
		allowdMapper.allowdDelete(allowdId);
		
		//규칙 재 생성
		for(String departmentId1 : departmentId) {
			DepartmentDTO dto = new DepartmentDTO();
			
			dto.setAllowdId(departmentCommand.getAllowdId());
			dto.setAllowdName(departmentCommand.getAllowdName());
			dto.setDepartmentId(departmentId1);
			allowdMapper.allowdInsert(dto);
		}
		
	}

}
