package com.innochatbot.admin.service.allowd;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.PageBlockDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.mapper.AllowdMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class AllowdListService {
	@Autowired
	AllowdMapper allowdMapper;
	@Autowired
	ListPageService listPageService;

	public void allowdList(int page, int limitRow, String searchWord, String kind, Model model) {
		//1. 파라미터로 받아온 값을 listPageService에 넘겨서 각 페이지의 시작 행, 마지막 행 값을 dto에 받아온다.
		StartEndPageDTO dto = listPageService.StartEndRow(page, limitRow, null, searchWord, kind, null);
		
		//2. 출력하고자 하는 행의 전체 값을 가져온다.
		Integer count = allowdMapper.allowdCount();
		
		//3. dto를 Mapper에 넘겨서 각 페이지에 보여줄 값을 조회해서 List에 담아온다.
		List<DepartmentDTO> list = allowdMapper.allowdList(dto); 
		
		//4. 파라미터로 받아온 값, count, list를 listPageService에 넘겨서 화면에 출력한다.
		listPageService.ShowList(page, limitRow, count, searchWord, list, model,null, kind);
		
		
	}

	public PageResponse<DepartmentDTO> allowdList2( // JSON용 List 처리 로직
			int page, int limitRow, String searchWord, String kind) {
		StartEndPageDTO startEndPageDTO = listPageService.StartEndRow(page, limitRow, null, searchWord, kind, null);
		
		Integer count = allowdMapper.allowdCount();
		
		List<DepartmentDTO> list = allowdMapper.allowdList(startEndPageDTO);
		
		//페이지 블록 계산
		PageBlockDTO pageDTO = listPageService.PageBlock(page, limitRow, count);
		
		//PageResponse 반환
		PageResponse<DepartmentDTO> dto = new PageResponse<>();
		dto.setPage(page);
		dto.setLimitRow(limitRow);
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
