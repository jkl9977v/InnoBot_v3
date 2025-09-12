package com.innochatbot.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.mapper.DepartmentMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.admin.service.department.DepartmentDetailService;
import com.innochatbot.admin.service.department.DepartmentListService;
import com.innochatbot.admin.service.department.DepartmentUpdateService;
import com.innochatbot.admin.service.department.DepartmentWriteService;

@Controller
@RequestMapping("admin/department")
public class DepartmentController {
	@Autowired
	AutoNumService autoNumService;
	@Autowired
	DepartmentWriteService departmentWriteService;
	@Autowired
	DepartmentListService departmentListService;
	@Autowired
	DepartmentDetailService departmentDetailService;
	@Autowired
	DepartmentUpdateService departmentUpdateService;
	
	@GetMapping("departmentWrite")
	public String departmentWrite(DepartmentCommand departmentCommand
			, @RequestParam (defaultValue = "dep_") String sep
			, @RequestParam (defaultValue = "department_id") String column
			, @RequestParam (defaultValue = "5") int len
			, @RequestParam (defaultValue = "department") String table
			, Model model) {
		departmentCommand.setDepartmentId(autoNumService.autoNum1(sep, column, len, table));
		model.addAttribute("command", departmentCommand);
		return "thymeleaf/department/departmentWrite";
	}
	@PostMapping("departmentWrite")
	public String departmentWrite1(DepartmentCommand departmentCommand) {
		departmentWriteService.departmentWrite(departmentCommand);
		return "redirect:/admin/department/departmentList";
	}
	@GetMapping("departmentList")
	public String departmentList(@RequestParam(defaultValue="1") int page
			, @RequestParam(defaultValue = "10") int limitPage
			, @RequestParam(required = false) String searchWord
			, @RequestParam(required = false) String kind
			, Model model) {
		departmentListService.departmentList(page, limitPage, searchWord, kind, model);
		return "thymeleaf/department/departmentList";
	}
	@GetMapping("departmentSearch")
	public String departmentSearch(@RequestParam(defaultValue="1") int page
			, @RequestParam(defaultValue = "10") int limitPage
			, @RequestParam(required = false) String searchWord
			, @RequestParam(required = false) String kind
			, Model model) {
		departmentListService.departmentList(page, limitPage, searchWord, kind, model);
		return "thymeleaf/department/departmentSearch";
	}
	@GetMapping("departmentMultiSelect")
	public String departmemtMultiSelect(@RequestParam(defaultValue="0") int page
			, @RequestParam(defaultValue = "0") int limitPage
			, @RequestParam(required = false) String searchWord
			, @RequestParam(required = false) String kind
			, Model model) {
		departmentListService.departmentList(page, limitPage, searchWord, kind, model);
		return "thymeleaf/department/departmentMultiSelect";
	}
	@GetMapping("departmentDetail")
	public String departmentDetail(@RequestParam String departmentId, Model model) {
		departmentDetailService.departmentDetail(departmentId, model);
		return "thymeleaf/department/departmentDetail";
	}
	@GetMapping("departmentUpdate")
	public String departmentUpdate(@RequestParam String departmentId, Model model) {
		departmentDetailService.departmentDetail(departmentId, model);
		return "thymeleaf/department/departmentUpdate";
	}
	@PostMapping("departmentUpdate")
	public String departmentUpdate1(DepartmentCommand departmentCommand) {
		departmentUpdateService.departmentUpdate(departmentCommand);
		return "redirect:/admin/department/departmentList";
	}
	@Autowired
	DepartmentMapper departmentMapper;
	@GetMapping("departmentDelete")
	public String departmentDelete(@RequestParam String departmentId) {
		departmentMapper.departmentDelete(departmentId);
		return "redirect:/admin/department/departmentList";
	}

}
