package com.innochatbot.admin.service.accessRule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.AccessRuleDTO;
import com.innochatbot.admin.mapper.AccessRuleMapper;

@Service
public class AccessRuleDetailService {

    @Autowired
    AccessRuleMapper accessRuleMapper;

    public void accessDetail(String accessId, Model model) {
        AccessRuleDTO dto = accessRuleMapper.accessRuleDetail(accessId);
        model.addAttribute("dto", dto);
        
        System.out.println(dto);
    }
}
