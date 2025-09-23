package com.innochatbot.admin.service.accessRule;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.AccessRuleDTO;
import com.innochatbot.admin.dto.PageBlockDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.mapper.AccessRuleMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class AccessRuleListService {

    @Autowired
    AccessRuleMapper accessRuleMapper;
    @Autowired
    ListPageService listPageService;

    public void accessList( int page, int limitRow, String searchWord, String kind,Model model) {
        StartEndPageDTO dto=listPageService.StartEndRow(page, limitRow, null, searchWord, kind, null);
        Integer count = accessRuleMapper.accessRuleCount();
        
        List<AccessRuleDTO> list = accessRuleMapper.accessRuleList(dto);
        
        listPageService.ShowList(page, limitRow, count, searchWord, list, model, null, kind );

    }

	public PageResponse<AccessRuleDTO> accessList2( //JSON용 List 처리 로직
			int page, int limitRow, String searchWord, String kind
	) {
		StartEndPageDTO startEndPageDTO = listPageService.StartEndRow(page, limitRow, kind, searchWord, kind, null);
		
		Integer count = accessRuleMapper.accessRuleCount();
		
		List<AccessRuleDTO> list = accessRuleMapper.accessRuleList(startEndPageDTO);
		
		//페이지 블록 계산
		PageBlockDTO pageDTO = listPageService.PageBlock(page, limitRow, count);
		
		//PageResponse 반환
		PageResponse<AccessRuleDTO> dto = new PageResponse<>();
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
