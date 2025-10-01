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

import com.innochatbot.admin.command.DepartmentCommand;
import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.mapper.DepartmentMapper;
import com.innochatbot.admin.service.department.DepartmentDetailService;
import com.innochatbot.admin.service.department.DepartmentListService;
import com.innochatbot.admin.service.department.DepartmentUpdateService;
import com.innochatbot.admin.service.department.DepartmentWriteService;

@RestController
@RequestMapping("admin/department")
public class DepartmentRestController {
	@Autowired
	DepartmentWriteService departmentWriteService;
	@Autowired
	DepartmentListService departmentListService;
	@Autowired
	DepartmentDetailService departmentDetailService;
	@Autowired
	DepartmentUpdateService departmentUpdateService;
	
	/*
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
	*/
	
	@PostMapping(value = "departmentWrite", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> departmentWrite1(@RequestBody DepartmentCommand departmentCommand) {
		System.out.println(departmentCommand);
		Boolean insertResult = departmentWriteService.departmentWrite(departmentCommand);
		
		if (insertResult ) {
			// 200 ok + { success:true } JSON 객체 전달
			return ResponseEntity.ok(Collections.singletonMap("success", true)); //성공 JSON, redirect: 200 ok
		} else {
			// 500 (또는 400 ) -> 프론트가 예외처리 가능
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonMap("isnert_error", false)); //실패 JSON
		}
	}
	/*
	@GetMapping("departmentList")
	public String departmentList(@RequestParam(defaultValue="1") int page
			, @RequestParam(defaultValue = "10") int limitPage
			, @RequestParam(required = false) String searchWord
			, @RequestParam(required = false) String kind
			, Model model) {
		departmentListService.departmentList(page, limitPage, searchWord, kind, model);
		return "thymeleaf/department/departmentList";
	}
	*/
	@GetMapping("departmentList")
	public PageResponse<DepartmentDTO> departmentList(@RequestParam(defaultValue="1") int page
			, @RequestParam(defaultValue = "10") int limitPage
			, @RequestParam(required = false) String searchWord
			, @RequestParam(required = false) String kind
			) {
		return departmentListService.departmentList2(page, limitPage, searchWord, kind);
	}
	/*
	@GetMapping("departmentSearch")
	public PageResponse<DepartmentDTO> departmentSearch(@RequestParam(defaultValue="1") int page
			, @RequestParam(defaultValue = "10") int limitPage
			, @RequestParam(required = false) String searchWord
			, @RequestParam(required = false) String kind
			, Model model) {
		//departmentListService.departmentList(page, limitPage, searchWord, kind, model);
		return departmentListService.departmentList2(page, limitPage, searchWord, kind);
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
	*/
	@GetMapping("departmentDetail")
	public ResponseEntity<?> departmentDetail(@RequestParam String departmentId) {
		System.out.println(departmentId);
		
		// departmentId가 있을 때 200ok + DTO
		if (departmentId != null && !departmentId.trim().isEmpty()) {
			DepartmentDTO dto = departmentDetailService.departmentDetail2(departmentId);
			return ResponseEntity.ok(dto);
		} else {
			return ResponseEntity.badRequest()
					.body("departmentId 값이 없습니다.");
		}
	}
	/*
	@GetMapping("departmentUpdate")
	public String departmentUpdate(@RequestParam String departmentId, Model model) {
		departmentDetailService.departmentDetail(departmentId, model);
		return "thymeleaf/department/departmentUpdate";
	}
	*/
	@PostMapping("departmentUpdate")
	public ResponseEntity<?> departmentUpdate(@RequestBody DepartmentCommand departmentCommand) {
		System.out.println(departmentCommand);
		Boolean updateResult = departmentUpdateService.departmentUpdate(departmentCommand);
		
		if (updateResult) {
			//200 ok + { success: true } JSON 객체 전달
			return ResponseEntity.ok(Collections.singletonMap("success", true));
		} else {
			// 500 (또는 400)  -> 프론트가 예외처리함
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonMap("update_error", false)); //실패 JSON
		}
	}
	@Autowired
	DepartmentMapper departmentMapper;
	@GetMapping("departmentDelete")
	public String departmentDelete(@RequestParam String departmentId) {
		departmentMapper.departmentDelete(departmentId);
		return "redirect:/admin/department/departmentList";
	}

}
