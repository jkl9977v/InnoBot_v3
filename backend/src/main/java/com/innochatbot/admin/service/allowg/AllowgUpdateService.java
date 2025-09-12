package com.innochatbot.admin.service.allowg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.GradeCommand;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.mapper.AllowgMapper;
import com.innochatbot.admin.mapper.GradeMapper;

@Service
public class AllowgUpdateService {
	@Autowired
	AllowgMapper allowgMapper;
	@Autowired
	GradeMapper gradeMapper;

	public void allowgUpdate(GradeCommand gradeCommand) {
		List<GradeDTO> list = gradeMapper.gradeList(null, gradeCommand.getGradeLevel());
		allowgMapper.allowgDelete(gradeCommand.getAllowgId());
		for(GradeDTO gDTO : list) {
			GradeDTO dto = new GradeDTO();
			
			dto.setAllowgId(gradeCommand.getAllowgId());
			dto.setAllowgName(gradeCommand.getAllowgName());
			dto.setGradeId(gDTO.getGradeId());
			
			allowgMapper.allowgInsert(dto);
		}
	}
}
