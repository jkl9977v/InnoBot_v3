package com.innochatbot.admin.service.allowg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

	@Transactional
	public boolean allowgUpdate(GradeCommand gradeCommand) {
		List<GradeDTO> list = gradeMapper.gradeList(null, gradeCommand.getGradeLevel());
		Integer i = allowgMapper.allowgCount2(gradeCommand.getAllowgId());
		
		//System.out.println("삭제할 행 개수: " + i);
		int deleteResult = 0;
		deleteResult += allowgMapper.allowgDelete(gradeCommand.getAllowgId());
		
		int updateResult = 0;
		
		if (deleteResult == i) {
			
			for(GradeDTO gDTO : list) {
				GradeDTO dto = new GradeDTO();
				
				dto.setAllowgId(gradeCommand.getAllowgId());
				dto.setAllowgName(gradeCommand.getAllowgName());
				dto.setGradeId(gDTO.getGradeId());
				
				updateResult += allowgMapper.allowgInsert(dto);
			}
		}

		return updateResult == list.size();
	}
}
