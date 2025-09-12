package com.innochatbot.admin.service.allowg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.GradeCommand;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.mapper.AllowgMapper;
import com.innochatbot.admin.mapper.GradeMapper;

@Service
public class AllowgWriteService {
	@Autowired
    AllowgMapper allowgMapper;
	@Autowired
	GradeMapper gradeMapper;

	public void allowgWrite(GradeCommand gradeCommand) {
		//사용자가 선택한 직급 레벨 이상 리스트 가져오기
		List<GradeDTO> list = gradeMapper.gradeList(null, gradeCommand.getGradeLevel());
		System.out.println(list);
		
		//리스트에 담긴 gradeId 개수만큼 반복하여 insert
		for(GradeDTO gDTO : list) {
			GradeDTO dto = new GradeDTO();
			
			dto.setAllowgId(gradeCommand.getAllowgId());
			dto.setAllowgName(gradeCommand.getAllowgName());
			dto.setGradeId(gDTO.getGradeId());
			
			allowgMapper.allowgInsert(dto);
		}		
	}

}
