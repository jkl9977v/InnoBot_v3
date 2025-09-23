package com.innochatbot.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.admin.command.GradeCommand;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.mapper.AllowgMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.admin.service.allowg.AllowgDetailService;
import com.innochatbot.admin.service.allowg.AllowgListService;
import com.innochatbot.admin.service.allowg.AllowgUpdateService;
import com.innochatbot.admin.service.allowg.AllowgWriteService;

@RequestMapping("admin/accessRule")
@RestController
public class AllowgRestController {
	@Autowired
	AutoNumService autoNumService;
	
	@Autowired
    AllowgWriteService allowgWriteService;
    @Autowired
    AllowgListService allowgListService;
    @Autowired
    AllowgDetailService allowgDetailService;
    @Autowired
    AllowgUpdateService allowgUpdateService;
    
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
    @PostMapping("allowgWrite")
    public String allowgWrite1(GradeCommand gradeCommand) {
    	allowgWriteService.allowgWrite(gradeCommand);
    	return "redirect:/admin/accessRule/allowgList";
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
