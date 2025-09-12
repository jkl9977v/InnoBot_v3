package com.innochatbot.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.StartEndPageDTO;

@Service
public class ListPageService {

	public StartEndPageDTO StartEndRow(int page, int limitRow, String pathId, String searchWord, String kind, String kind2) {
		StartEndPageDTO dto = new StartEndPageDTO();
		if (limitRow != 0) {
			int startRow=(page-1)*limitRow+1;
			int endRow=startRow+limitRow-1;
			dto.setStartRow(startRow);
			dto.setEndRow(endRow);
		}else {
			dto.setStartRow(0);
			dto.setEndRow(0);
		}
		dto.setIdColumn(pathId);
		dto.setSearchWord(searchWord);
		dto.setKind(kind);
		dto.setKind2(kind2);
		
		return dto;
		
	}

	public void ShowList(int page, int limitRow, Integer count, String searchWord, List list,
			Model model, String pathId, String kind) {
		Integer startPageNum=0;
		Integer endPageNum=0;
		Integer maxPageNum=0;
		if (page != 0 && limitRow !=0) {
			Integer limitPage=10;
			startPageNum=(int)((double)page/limitPage-0.05)*limitPage+1;
			endPageNum=startPageNum+limitPage-1;
			maxPageNum=(int)Math.ceil((double)count/limitRow);
			System.out.println("최대 페이지: "+maxPageNum);
			
			if(endPageNum>maxPageNum) endPageNum=maxPageNum;
		}
		
		if(searchWord==null) searchWord="";
		//if(kind==null) kind="";
		model.addAttribute("page", page);
		model.addAttribute("startPageNum", startPageNum);
		model.addAttribute("endPageNum", endPageNum);
		model.addAttribute("maxPageNum", maxPageNum);
		model.addAttribute("limitRow", limitRow);
		model.addAttribute("searchWord", searchWord);
		model.addAttribute("list", list);
		model.addAttribute("count", count);
		model.addAttribute("kind", kind);
		if(pathId!=null) {
			model.addAttribute("pathId", pathId);
		}
		//model.addAttribute("kind", kind);
		
	}

}
