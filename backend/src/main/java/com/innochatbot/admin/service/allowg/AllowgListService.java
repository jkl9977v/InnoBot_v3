package com.innochatbot.admin.service.allowg;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.mapper.AllowgMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class AllowgListService {
	@Autowired
	AllowgMapper allowgMapper;
	@Autowired
	ListPageService listPageService;
	
	public void allowgList(int page, int limitRow, String searchWord, String kind, Model model) {
		//1. 파라미터로 받아온 값을 listPageService에 넘겨서 각 페이지의 시작 행, 마지막 행 값을 dto에 받아온다.
		StartEndPageDTO dto = listPageService.StartEndRow(page, limitRow, null, searchWord, kind, null);
		
		//2. 출력하고자 하는 행의 전체 값을 가져온다.
		Integer count = allowgMapper.allowgCount();
		
		//3. dto를 Mapper에 넘겨서 각 페이지에 보여줄 값을 조회해서 List에 담아온다.
		List<GradeDTO> list = allowgMapper.allowgList(dto);
		System.out.println(dto);
		//System.out.println(list);
		
		//4. 파라미터로 받아온 값, count, list를 listPageService에 넘겨서 화면에 출력한다.
		listPageService.ShowList(page, limitRow, count, searchWord, list, model, null, kind);
		
	}

}
