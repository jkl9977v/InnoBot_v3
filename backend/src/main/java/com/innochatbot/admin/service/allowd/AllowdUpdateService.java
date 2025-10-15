package com.innochatbot.admin.service.allowd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.mapper.AllowdMapper;

import jakarta.transaction.Transactional;

@Service
public class AllowdUpdateService {
	@Autowired
	AllowdMapper allowdMapper;
	
	@Transactional
	public boolean allowdUpdate(DepartmentCommand departmentCommand) {
		//기존 규칙 삭제
		String allowdId=departmentCommand.getAllowdId();
		
		Integer i = allowdMapper.allowdCount2(allowdId);
		int deleteResult = 0;
		deleteResult += allowdMapper.allowdDelete(allowdId);
		
		int updateResult = 0;
		
		if (deleteResult == i ) {
			//규칙 재 생성
			for(String departmentId1 : departmentCommand.getDepartmentIds()) {
				DepartmentDTO dto = new DepartmentDTO();
				
				dto.setAllowdId(departmentCommand.getAllowdId());
				dto.setAllowdName(departmentCommand.getAllowdName());
				dto.setDepartmentId(departmentId1);
				updateResult += allowdMapper.allowdInsert(dto);
			}
		}
		
		return updateResult == departmentCommand.getDepartmentIds().size();
		
	}

}
