package com.innochatbot.admin.service.filePath;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.FilePathDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.mapper.FilePathMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class FilePathListService {

    @Autowired
    FilePathMapper filePathMapper;
    @Autowired
    ListPageService listPageService;


	public void filePathList(int page, int limitRow, String pathId, String searchWord, Model model, String kind) {
		
		StartEndPageDTO dto=listPageService.StartEndRow(page,limitRow, pathId, searchWord, kind, null ); //kind=null;
		
		List<FilePathDTO> list = filePathMapper.filePathList(dto);
		Integer count = filePathMapper.filePathCount(pathId);
		
		listPageService.ShowList(page, limitRow, count,searchWord, list, model, pathId, kind);
		FilePathDTO filePathDTO = filePathMapper.filePathDetail2(pathId);
		model.addAttribute("filePathDTO", filePathDTO);
		
	}


	public void filePathSearch(String searchWord, Model model) {
		List<FilePathDTO> list = filePathMapper.filePathListAll(searchWord);
		System.out.println(list);
		model.addAttribute("list", list);
		
	}

}
