package com.innochatbot.admin.service.allowg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.innochatbot.admin.command.GradeCommand;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.mapper.AllowgMapper;
import com.innochatbot.admin.mapper.GradeMapper;
import com.innochatbot.admin.service.AutoNumService;

@Service
@Transactional                          // N개의 insert 모두 성공 시만 커밋
public class AllowgWriteService {
	@Autowired
    AllowgMapper allowgMapper;
	@Autowired
	GradeMapper gradeMapper;
	@Autowired
	AutoNumService autoNumService;

	public Boolean allowgWrite(GradeCommand gradeCommand) {
		
		//유저번호 생성
		String sep = "allowg_";
		String column = "allowg_id";
		int len = 8;
		String table = "allow_grade";
		
		String allowgId = autoNumService.autoNum1(sep, column, len, table);
		
		//사용자가 선택한 직급 레벨 이상 리스트 가져오기
		List<GradeDTO> list = gradeMapper.gradeList(null, gradeCommand.getGradeLevel());
		System.out.println(list);
		
		int insertResult = 0;
		//리스트에 담긴 gradeId 개수만큼 반복하여 insert
		for(GradeDTO gDTO : list) {
			GradeDTO dto = new GradeDTO();
			
			dto.setAllowgId(allowgId);
			dto.setAllowgName(gradeCommand.getAllowgName());
			dto.setGradeId(gDTO.getGradeId());
			
			insertResult += allowgMapper.allowgInsert(dto);
		}
		
		return insertResult == list.size();
	}

}
