package com.innochatbot.admin.service.accessRule;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import com.innochatbot.admin.dto.AccessRuleDTO;
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

}
