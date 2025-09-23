package com.innochatbot.admin.service.filePath;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.FileListResponse;
import com.innochatbot.admin.dto.FilePathDTO;
import com.innochatbot.admin.dto.PageBlockDTO;
import com.innochatbot.admin.dto.PageResponse;
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

	//JSON용
	public FileListResponse filePathList2(int page, int limitRow, String pathId, String searchWord,
			String kind) {
		StartEndPageDTO startEndPageDTO = listPageService.StartEndRow(page, limitRow, pathId, searchWord, kind, null);
		
		List<FilePathDTO> list = filePathMapper.filePathList(startEndPageDTO); // PathId의 파일, 폴더 리스트
		
		Integer count = filePathMapper.filePathCount(pathId);
		
		//페이지 블록 계산
		PageBlockDTO pageDTO = listPageService.PageBlock(page, limitRow, count);
		
		//PageResponse 로직
		PageResponse<FilePathDTO> filePath = new PageResponse<>();
		filePath.setPage(page);
		filePath.setLimitRow(limitRow);
		filePath.setStartPageNum(pageDTO.getStartPageNum());
		filePath.setEndPageNum(pageDTO.getEndPageNum());
		filePath.setMaxPageNum(pageDTO.getMaxPageNum());
		filePath.setCount(count);
		filePath.setSearchWord(searchWord);
		filePath.setKind(kind);
		//filePath.setKind2(kind2);
		filePath.setList(list);
		
		System.out.println(list);
		
		//경로 정보 옵션
		FilePathDTO pathDetail2 = filePathMapper.filePathDetail2(pathId);
		
		//Wrapper 사용
		FileListResponse res = new FileListResponse();
		res.setFileList(filePath);
		res.setPathDetial(pathDetail2);
		
		return res;
	}

}
