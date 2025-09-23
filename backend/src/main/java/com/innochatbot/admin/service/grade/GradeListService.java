package com.innochatbot.admin.service.grade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.PageBlockDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.mapper.GradeMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class GradeListService {
	@Autowired
	GradeMapper gradeMapper;
	@Autowired
	ListPageService listPageService;
	
	public void gradeList(int page, int limitRow, String searchWord, String kind, Model model) {
		//1. 
		StartEndPageDTO dto = listPageService.StartEndRow(page, limitRow, null, searchWord, kind , null);
		
		//2.
		Integer count = gradeMapper.gradeCount(null);
		
		//3. 
		List<GradeDTO> list = gradeMapper.gradeList(dto, null);
		
		//4. 
		listPageService.ShowList(page, limitRow, count, searchWord, list, model, null, kind);
	}

	public PageResponse<GradeDTO> gradeList2(int page, int limitRow, String searchWord,
			String kind) {
		StartEndPageDTO startPageDTO = listPageService.StartEndRow(page, limitRow, null, searchWord, kind, null);
		
		Integer count = gradeMapper.gradeCount(null);
		
		List<GradeDTO> list = gradeMapper.gradeList(startPageDTO, null);
		
		//페이지 블록 계산
		PageBlockDTO pageDTO = listPageService.PageBlock(page, limitRow, count);
		
		//PageResponse 반환
		PageResponse<GradeDTO> dto = new PageResponse<>();
		dto.setPage(page);
		dto.setLimitRow(limitRow);
		dto.setStartPageNum(pageDTO.getStartPageNum());
		dto.setEndPageNum(pageDTO.getEndPageNum());
		dto.setMaxPageNum(pageDTO.getMaxPageNum());
		dto.setCount(count);
		dto.setSearchWord(searchWord);
		dto.setKind(kind);
		//dto.setKind2(kind2);
		dto.setList(list);
		
		
		return dto;
	}

}
