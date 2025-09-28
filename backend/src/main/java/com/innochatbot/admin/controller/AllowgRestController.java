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

import com.innochatbot.admin.command.GradeCommand;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.mapper.AllowgMapper;
import com.innochatbot.admin.service.allowg.AllowgDetailService;
import com.innochatbot.admin.service.allowg.AllowgListService;
import com.innochatbot.admin.service.allowg.AllowgUpdateService;
import com.innochatbot.admin.service.allowg.AllowgWriteService;

@RequestMapping("admin/accessRule")
@RestController
public class AllowgRestController {
	@Autowired
    AllowgWriteService allowgWriteService;
    @Autowired
    AllowgListService allowgListService;
    @Autowired
    AllowgDetailService allowgDetailService;
    @Autowired
    AllowgUpdateService allowgUpdateService;
    
    /*
    @GetMapping("allowgWrite")
    public String allowgWrite(GradeCommand gradeCommand
    		, @RequestParam(defaultValue = "allowg_") String sep
    		, @RequestParam(defaultValue = "allowg_id") String column
    		, @RequestParam(defaultValue = "8") int len
    		, @RequestParam(defaultValue = "allow_grade") String table
    		, Model model) {
    	gradeCommand.setAllowgId(autoNumService.autoNum1(sep, column, len, table));
    	model.addAttribute("command", gradeCommand);
    	return "thymeleaf//allowGrade/allowgWrite";
    }
    */
    @PostMapping(value="allowgWrite", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> allowgWrite1(@RequestBody GradeCommand gradeCommand) {
    	System.out.println(gradeCommand);
    	Boolean insertResult = allowgWriteService.allowgWrite(gradeCommand);
    	if(insertResult) {
			// 200 ok + {success:ture} JSON 객체 전달
			return ResponseEntity.ok(Collections.singletonMap("success", true)); //성공 JSON, redirect: 200ok
		} else {
			// 500 (또는 400 ) -> 프론트가 예외처리 가능
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonMap("insert_error", false)); // 실패 JSON
		}
    }
    /*
    @GetMapping("allowgList")
    public String allowgList(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		, Model model) {
    	allowgListService.allowgList(page, limitRow, searchWord, kind, model);
    	return "thymeleaf/allowGrade/allowgList";
    }
    */
    @GetMapping("allowgList")
    public PageResponse<GradeDTO> allowgList(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		) {
    	return allowgListService.allowgList2(page, limitRow, searchWord, kind);
    }
    @GetMapping("allowgSearch")
    public String allowgSearch(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		, Model model) {
    	allowgListService.allowgList(page, limitRow, searchWord, kind, model);
    	return "thymeleaf/allowGrade/allowgSearch";
    }
    @GetMapping("allowgDetail")
    public String allowgDetail(@RequestParam String allowgId, Model model) {
    	allowgDetailService.allowgDetail(allowgId, model);
    	return "thymeleaf/allowGrade/allowgDetail";
    }
    @GetMapping("allowgUpdate")
    public String allowgUpdate(@RequestParam String allowgId, Model model) {
    	allowgDetailService.allowgDetail(allowgId, model);
    	return "thymeleaf/allowGrade/allowgUpdate";
    }
    @PostMapping("allowgUpdate")
    public String allowgUpdate1(GradeCommand gradeCommand) {
    	allowgUpdateService.allowgUpdate(gradeCommand);
    	return "redirect:/admin/accessRule/allowgList";
    }
    @Autowired
    AllowgMapper allowgMapper;
    
    @GetMapping("allowgDelete")
    public String allowgDelete(@RequestParam String allowgId) {
    	allowgMapper.allowgDelete(allowgId);
    	return "redirect:/admin/accessRule/allowgList";
    }
}
