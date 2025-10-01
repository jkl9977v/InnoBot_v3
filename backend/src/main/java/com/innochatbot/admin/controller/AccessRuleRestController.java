package com.innochatbot.admin.controller;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.admin.command.AccessRuleCommand;
import com.innochatbot.admin.dto.AccessRuleDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.mapper.AccessRuleMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.admin.service.accessRule.AccessRuleDetailService;
import com.innochatbot.admin.service.accessRule.AccessRuleListService;
import com.innochatbot.admin.service.accessRule.AccessRuleUpdateService;
import com.innochatbot.admin.service.accessRule.AccessRuleWriteService;

@RestController
@RequestMapping("admin/accessRule")
public class AccessRuleRestController { //파일 경로 관리
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
    
    /*
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
    */

    @PostMapping(value = "accessWrite", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> AccessRuleWrite1(@RequestBody AccessRuleCommand accessRuleCommand) {
    	System.out.println(accessRuleCommand);
    	Boolean insertResult = accessRuleWriteService.accessWrite(accessRuleCommand);
    	
    	if(insertResult) {
    		//200 oK + { success:true} JSON 객체 전달
    		return ResponseEntity.ok(Collections.singletonMap("success", true)); //성공 JSON, redirect: 200 ok
    	} else {
    		// 500 (또는 400) - > 프론트가 예외처리 가능
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    				.body(Collections.singletonMap("insert_error", false)); //실패 JSON
    	}
    }
    /*//기존 코드
    @GetMapping("accessList")
    public Map<String, Object> AccessRuleList(@RequestParam (defaultValue = "1") int page
    		, @RequestParam (defaultValue = "10") int limitRow
    		, @RequestParam (required = false) String searchWord
    		, @RequestParam (required = false) String kind
    		) {
        accessRuleListService.accessList(page, limitRow, searchWord,kind);
        return "thymeleaf/accessRule/accessList";
    }
    */

    //현재 사용중인 accessList 코드
    @GetMapping("accessList")
    public PageResponse<AccessRuleDTO> AccessRuleList(@RequestParam (defaultValue = "1") int page
    		, @RequestParam (defaultValue = "10") int limitRow
    		, @RequestParam (required = false) String searchWord
    		, @RequestParam (required = false) String kind
    		) {
        return accessRuleListService.accessList2(page, limitRow, searchWord,kind);
    }
    
    // accessList와 코드 합침
    /*
    @GetMapping("accessSearch")
    public String AccessRuleSearch(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		, Model model) {
        accessRuleListService.accessList(page, limitRow, searchWord,kind, model);
        return "thymeleaf/accessRule/accessSearch";
    }
    */
    
    //detail
    @GetMapping("accessDetail")
    public ResponseEntity<?> AccessRuleDetail(@RequestParam String accessId) {
    	System.out.println(accessId);
    	
    	// accessId가 있을때 200ok + DTO
    	if (accessId != null && !accessId.trim().isEmpty()) {
    		AccessRuleDTO dto = accessRuleDetailService.accessDetail2(accessId);
    		return ResponseEntity.ok(dto);
    	} else { // accessId 없을때
    		return ResponseEntity.badRequest()
    				.body("accessId 값이 없습니다.");
    	}
    }
    
    /*
    @GetMapping("accessUpdate")
    public String AccessRuleUpdate(@RequestParam String accessId, Model model) {
    	accessRuleDetailService.accessDetail(accessId, model);
        return "thymeleaf/accessRule/accessUpdate";
    }
    */

    @PostMapping("accessUpdate")
    public String AccessRuleUpdate1(AccessRuleCommand accessRuleCommand) {
    	accessRuleUpdateService.accessUpdate(accessRuleCommand);
        return "redirect:accessList";
    }
    
    @Autowired
    AccessRuleMapper accessRuleMapper;

    @GetMapping("accessDelete") //삭제 로직 정상 작동 확인
    public void AccessRuleDelete(@RequestParam String accessId) {
    	accessRuleMapper.accessRuleDelete(accessId);
        //return "redirect:accessList";
    }   
}
