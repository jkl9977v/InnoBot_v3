package com.innochatbot.admin.service.grade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.GradeCommand;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.mapper.GradeMapper;

@Service
public class GradeUpdateService {
	@Autowired
	GradeMapper gradeMapper;

	public Boolean gradeUpdate(GradeCommand gradeCommand) {
		GradeDTO dto = new GradeDTO();
		
		dto.setGradeId(gradeCommand.getGradeId());
		dto.setGradeName(gradeCommand.getGradeName());
		dto.setGradeLevel(gradeCommand.getGradeLevel());
		
		int updateResult = gradeMapper.gradeUpdate(dto);
		return updateResult == 1;
	}
}
