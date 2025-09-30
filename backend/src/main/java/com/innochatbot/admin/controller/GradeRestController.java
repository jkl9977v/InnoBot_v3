package com.innochatbot.admin.controller;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.innochatbot.admin.mapper.GradeMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.admin.service.grade.GradeDetailService;
import com.innochatbot.admin.service.grade.GradeListService;
import com.innochatbot.admin.service.grade.GradeUpdateService;
import com.innochatbot.admin.service.grade.GradeWriteService;

@RestController
@RequestMapping("admin/grade")
public class GradeRestController {
	
	@Autowired
	AutoNumService autoNumService;
	@Autowired
	GradeWriteService gradeWriteService;
	@Autowired
	GradeListService gradeListService;
	@Autowired
	GradeDetailService gradeDetailService;
	@Autowired
	GradeUpdateService gradeUpdateService;
	
	/*
	@GetMapping("gradeWrite")
	public String gradeWrite(GradeCommand gradeCommand
			, @RequestParam (defaultValue = "grade_") String sep
			, @RequestParam (defaultValue = "grade_id") String column
			, @RequestParam (defaultValue = "7") int len
			, @RequestParam (defaultValue = "grade") String table
			, Model model) {
		gradeCommand.setGradeId(autoNumService.autoNum1(sep, column, len, table));
		model.addAttribute("command", gradeCommand);
		return "thymeleaf/grade/gradeWrite";
	}
	*/
	@PostMapping("gradeWrite")
	public ResponseEntity<?> gradeWrite1(@RequestBody GradeCommand gradeCommand) {
		System.out.println(gradeCommand);
		Boolean insertResult = gradeWriteService.gradeWrite(gradeCommand);
		if (insertResult) {
			// 200 ok + {success: true} JSON 객체 전달
			return ResponseEntity.ok(Collections.singletonMap("success", true)); // 성공 JSON, redirect : 200 ok
		} else {
			// 500 (또는 400)  -> 프론트가 예외처리 가능
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonMap("insert_error", false)); //실패 JSON
		}
	}
	/*
	@GetMapping("gradeList")
	public String gradeList(@RequestParam (defaultValue = "1") int page
			, @RequestParam (defaultValue = "10") int limitRow
			, @RequestParam (required = false) String searchWord
			, @RequestParam (required = false) String kind
			, Model model) {
		gradeListService.gradeList(page, limitRow, searchWord, kind, model);
		return "thymeleaf/grade/gradeList";
	}
	*/
	@GetMapping("gradeList")
	public PageResponse<GradeDTO> gradeList(@RequestParam (defaultValue = "1") int page
			, @RequestParam (defaultValue = "10") int limitRow
			, @RequestParam (required = false) String searchWord
			, @RequestParam (required = false) String kind
			) {
		return gradeListService.gradeList2(page, limitRow, searchWord, kind);
	}
	@GetMapping("gradeSearch")
	public String gradeSearch(@RequestParam (defaultValue = "1") int page
			, @RequestParam (defaultValue = "10") int limitRow
			, @RequestParam (required = false) String searchWord
			, @RequestParam (required = false) String kind
			, Model model) {
		gradeListService.gradeList(page, limitRow, searchWord, kind, model);
		return "thymeleaf/grade/gradeSearch";
	}
	@GetMapping("gradeDetail")
	public String gradeDetail(@RequestParam String gradeId, Model model) {
		gradeDetailService.gradeDetail(gradeId, model);
		return "thymeleaf/grade/gradeDetail";
	}
	@GetMapping("gradeUpdate")
	public String gradeUpdate(@RequestParam String gradeId, Model model) {
		gradeDetailService.gradeDetail(gradeId, model);
		return "thymeleaf/grade/gradeUpdate";
	}
	@PostMapping("gradeUpdate")
	public String gradeUpdate1(GradeCommand gradeCommand) {
		gradeUpdateService.gradeUpdate(gradeCommand);
		return "redirect:/admin/grade/gradeList";
	}
	@Autowired
	GradeMapper gradeMapper;
	@GetMapping("gradeDelete")
	public String gradeDelete(@RequestParam String gradeId) {
		System.out.println(gradeId);
		gradeMapper.gradeDelete(gradeId);
		return "redirect:/admin/grade/gradeList";
	}

}
