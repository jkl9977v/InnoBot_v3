package com.innochatbot.admin.service.department;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.PageBlockDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.mapper.DepartmentMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class DepartmentListService {

	@Autowired
	DepartmentMapper departmentMapper;
	@Autowired
	ListPageService listPageService;

	public void departmentList(int page, int limitPage, String searchWord, String kind, Model model) {
		//1. 
		StartEndPageDTO dto = listPageService.StartEndRow(page, limitPage, null, searchWord, kind, null);
		
		Integer count = departmentMapper.departmentCount();
		
		List<DepartmentDTO> list = departmentMapper.departmentList(dto);
		System.out.println(dto);
		System.out.println(list);
		
		listPageService.ShowList(page, limitPage, count, searchWord, list, model, null, kind);
		
	}

	public PageResponse<DepartmentDTO> departmentList2(int page, int limitPage, String searchWord, String kind) {
		StartEndPageDTO startEndPageDTO = listPageService.StartEndRow(page, limitPage, null, searchWord, kind, null);
		
		Integer count = departmentMapper.departmentCount();
		
		List<DepartmentDTO> list = departmentMapper.departmentList(startEndPageDTO);
		
		//페이지 블록 계산
		PageBlockDTO pageDTO = listPageService.PageBlock(page, limitPage, count);
		
		//PageResponse 반환
		PageResponse<DepartmentDTO> dto = new PageResponse<>();
		dto.setPage(page);
		dto.setLimitRow(limitPage);
		dto.setStartPageNum(pageDTO.getStartPageNum());
		dto.setEndPageNum(pageDTO.getEndPageNum());
		dto.setMaxPageNum(pageDTO.getMaxPageNum());
		dto.setCount(count);
		dto.setSearchWord(searchWord);
		dto.setKind(kind);
		//dto.setKind2(kind2); //kind2 있는 부분에서만 사용
		dto.setList(list);
		
		return dto;
	}
}
