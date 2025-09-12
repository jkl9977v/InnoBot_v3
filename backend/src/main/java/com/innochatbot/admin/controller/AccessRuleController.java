package com.innochatbot.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.innochatbot.admin.command.AccessRuleCommand;
import com.innochatbot.admin.mapper.AccessRuleMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.admin.service.accessRule.AccessRuleDetailService;
import com.innochatbot.admin.service.accessRule.AccessRuleListService;
import com.innochatbot.admin.service.accessRule.AccessRuleUpdateService;
import com.innochatbot.admin.service.accessRule.AccessRuleWriteService;

@RequestMapping("admin/accessRule")
@Controller
public class AccessRuleController { //파일 경로 관리
	@Autowired
	AutoNumService autoNumService;

    @Autowired
    AccessRuleWriteService accessRuleWriteService;
    @Autowired
    AccessRuleListService accessRuleListService;
    @Autowired
    AccessRuleUpdateService accessRuleUpdateService;
    @Autowired
    AccessRuleDetailService accessRuleDetailService;
    
    //1. accessRule 기본
    @GetMapping("accessWrite") //경로 추가
    public String AccessRuleWrite(AccessRuleCommand accessRuleCommand
    		, @RequestParam(defaultValue = "rule_") String sep
    		, @RequestParam(defaultValue = "access_id") String column
    		, @RequestParam(defaultValue = "6") int len
    		, @RequestParam(defaultValue = "access_rule") String table
    		, Model model) {
    	accessRuleCommand.setAccessId(autoNumService.autoNum1(sep, column,len, table));
    	model.addAttribute("command", accessRuleCommand);
        return "thymeleaf/accessRule/accessWrite";
    }

    @PostMapping("accessWrite")
    public String AccessRuleWrite1(AccessRuleCommand accessRuleCommand) {
        accessRuleWriteService.accessWrite(accessRuleCommand);
        return "redirect:accessList";
    }

    @GetMapping("accessList")
    public String AccessRuleList(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		, Model model) {
        accessRuleListService.accessList(page, limitRow, searchWord,kind, model);
        return "thymeleaf/accessRule/accessList";
    }
    @GetMapping("accessSearch")
    public String AccessRuleSearch(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		, Model model) {
        accessRuleListService.accessList(page, limitRow, searchWord,kind, model);
        return "thymeleaf/accessRule/accessSearch";
    }

    @GetMapping("accessDetail")
    public String AccessRuleList1(@RequestParam String accessId, Model model) {
        accessRuleDetailService.accessDetail(accessId, model);
        return "thymeleaf/accessRule/accessDetail";
    }

    @GetMapping("accessUpdate")
    public String AccessRuleUpdate(@RequestParam String accessId, Model model) {
    	accessRuleDetailService.accessDetail(accessId, model);
        return "thymeleaf/accessRule/accessUpdate";
    }

    @PostMapping("accessUpdate")
    public String AccessRuleUpdate1(AccessRuleCommand accessRuleCommand) {
    	accessRuleUpdateService.accessUpdate(accessRuleCommand);
        return "redirect:accessList";
    }
    
    @Autowired
    AccessRuleMapper accessRuleMapper;

    @GetMapping("accessDelete")
    public String AccessRuleDelete(@RequestParam String accessId) {
    	accessRuleMapper.accessRuleDelete(accessId);
        return "redirect:accessList";
    }   
}
