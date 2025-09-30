package com.innochatbot.admin.service.accessRule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.AccessRuleCommand;
import com.innochatbot.admin.dto.AccessRuleDTO;
import com.innochatbot.admin.mapper.AccessRuleMapper;
import com.innochatbot.admin.service.AutoNumService;

@Service
public class AccessRuleWriteService {

    @Autowired
    AccessRuleMapper accessRuleMapper;
    @Autowired
    AutoNumService autoNumService;

    public Boolean accessWrite(AccessRuleCommand accessRuleCommand) {
    	
    	String sep = "rule_";
    	String column = "access_id";
    	int len = 6;
    	String tagle = "access_rule";
    	
    	String accessId = autoNumService.autoNum1(sep, column, len, tagle);
    	
        AccessRuleDTO dto = new AccessRuleDTO();

        dto.setAccessId(accessId);
        dto.setAccessName(accessRuleCommand.getAccessName());
        dto.setAllowdId(accessRuleCommand.getAllowdId());
        dto.setAllowgId(accessRuleCommand.getAllowgId());
        dto.setAccessType(accessRuleCommand.getAccessType());
        
        int insertResult = accessRuleMapper.accessRuleInsert(dto); //서버 입력 성공시 insertResult는 1이다.
        
        return insertResult == 1; // 1행 삽입 성공 시 true
    }

}
