package com.innochatbot.admin.service.grade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.GradeCommand;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.mapper.GradeMapper;
import com.innochatbot.admin.service.AutoNumService;

@Service
public class GradeWriteService {
	@Autowired
	GradeMapper gradeMapper;
	@Autowired
	AutoNumService autoNumService;

	public Boolean gradeWrite(GradeCommand gradeCommand) {
		String sep = "grade_";
		String column = "grade_id";
		int len = 7;
		String table = "grade";
		
		String gradeId = autoNumService.autoNum1(sep, column, len, table);
		
		int insertResult = 0;
		
		GradeDTO dto = new GradeDTO();

		dto.setGradeId(gradeId);
		dto.setGradeName(gradeCommand.getGradeName());
		dto.setGradeLevel(gradeCommand.getGradeLevel());

		insertResult = gradeMapper.gradeInsert(dto);
		
		return insertResult == 1;
	}

}
