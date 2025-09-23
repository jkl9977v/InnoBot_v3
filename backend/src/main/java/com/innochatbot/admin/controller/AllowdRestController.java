package com.innochatbot.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.mapper.AllowdMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.admin.service.allowd.AllowdDetailService;
import com.innochatbot.admin.service.allowd.AllowdListService;
import com.innochatbot.admin.service.allowd.AllowdUpdateService;
import com.innochatbot.admin.service.allowd.AllowdWriteService;

@RequestMapping("admin/accessRule")
@RestController
public class AllowdRestController {
	@Autowired
	AutoNumService autoNumService;
	
	@Autowired
    AllowdWriteService allowdWriteService;
    @Autowired
    AllowdListService allowdListService;
    @Autowired
    AllowdDetailService allowdDetailService;
    @Autowired
    AllowdUpdateService allowdUpdateService;
    
    @GetMapping("allowdWrite")
    public String allowdWrite(DepartmentCommand departmentCommand
    		, @RequestParam(defaultValue = "allowd_") String sep
    		, @RequestParam(defaultValue = "allowd_id") String column
    		, @RequestParam(defaultValue = "8") int len
    		, @RequestParam(defaultValue = "allow_departments") String table
    		, Model model
    		) {
    	departmentCommand.setAllowdId(autoNumService.autoNum1(sep, column,len, table));
    	model.addAttribute("command", departmentCommand);
    	return "thymeleaf/allowDepartment/allowdWrite";
    }
    @PostMapping("allowdWrite")
    public String allowdWrite1(DepartmentCommand departmentCommand
    		, @RequestParam("departmentId") List<String> departmentId) {
    	allowdWriteService.allowdWrite(departmentCommand, departmentId);
    	return "redirect:/admin/accessRule/allowdList";
    }
    /*
    @GetMapping("allowdList")
    public String allowdList(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		, Model model) {
    	allowdListService.allowdList(page, limitRow, searchWord, kind, model);
    	return "thymeleaf/allowDepartment/allowdList";
    }
    */
    @GetMapping("allowdList")
    public PageResponse<DepartmentDTO> allowdList(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		) {
    	return allowdListService.allowdList2(page, limitRow, searchWord, kind);
    }
    @GetMapping("allowdSearch")
    public String allowdSearch(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue="10") int limitRow
    		, @RequestParam (required=false) String searchWord
    		, @RequestParam (required=false) String kind
    		, Model model) {
    	allowdListService.allowdList(page, limitRow, searchWord, kind, model);
    	return "thymeleaf/allowDepartment/allowdSearch";
    }
    @GetMapping("allowdDetail")
    public String allowdDetail(@RequestParam String allowdId, Model model) {
    	allowdDetailService.allowdDetail(allowdId, model);
    	return "thymeleaf/allowDepartment/allowdDetail";
    }
    @GetMapping("allowdUpdate")
    public String allowdUpdate(@RequestParam String allowdId, Model model) {
    	allowdDetailService.allowdDetail(allowdId, model);
    	return "thymeleaf/allowDepartment/allowdUpdate";
    }
    @PostMapping("allowdUpdate")
    public String allowdUpdate1(DepartmentCommand departmentCommand
    		, @RequestParam("departmentId") List<String> departmentId) {
    	allowdUpdateService.allowdUpdate(departmentCommand, departmentId);
    	return "redirect:/admin/accessRule/allowdList";
    }
    
    @Autowired
    AllowdMapper allowdMapper;
    
    @GetMapping("allowdDelete")
    public String allowdDelete(@RequestParam String allowdId) {
    	allowdMapper.allowdDelete(allowdId);
    	return "redirect:/admin/accessRule/allowdList";
    }
}
