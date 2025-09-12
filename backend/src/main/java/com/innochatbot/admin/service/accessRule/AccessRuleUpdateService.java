package com.innochatbot.admin.service.accessRule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.AccessRuleCommand;
import com.innochatbot.admin.dto.AccessRuleDTO;
import com.innochatbot.admin.mapper.AccessRuleMapper;

@Service
public class AccessRuleUpdateService {

    @Autowired
    AccessRuleMapper accessRuleMapper;

    public void accessUpdate(AccessRuleCommand accessRuleCommand) {
        AccessRuleDTO dto = new AccessRuleDTO();

        dto.setAccessId(accessRuleCommand.getAccessId());
        dto.setAccessName(accessRuleCommand.getAccessName());
        dto.setAllowdId(accessRuleCommand.getAllowdId());
        dto.setAllowgId(accessRuleCommand.getAllowgId());
        dto.setAccessType(accessRuleCommand.getAccessType());
        
        accessRuleMapper.accessRuleUpdate(dto);
    }

}
