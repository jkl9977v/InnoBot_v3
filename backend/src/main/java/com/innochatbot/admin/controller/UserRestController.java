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

import com.innochatbot.admin.command.UserCommand;
import com.innochatbot.admin.dto.UserListResponse;
import com.innochatbot.admin.mapper.UserMapper;
import com.innochatbot.admin.service.user.UserDetailService;
import com.innochatbot.admin.service.user.UserListService;
import com.innochatbot.admin.service.user.UserUpdateService;
import com.innochatbot.admin.service.user.UserWriteService;

@RestController
@RequestMapping("admin/user")
public class UserRestController {
	@Autowired
	UserWriteService userWriteService;
	@Autowired
	UserListService userListService;
	@Autowired
	UserDetailService userDetailService;
	@Autowired
	UserUpdateService userUpdateService;
	
	/*
	@GetMapping("userWrite")
	public Map<String, String> userWrite(UserCommand userCommand
		, @RequestParam (defaultValue = "user_") String sep
		, @RequestParam (defaultValue = "user_num") String column
		, @RequestParam (defaultValue = "6") int len
		, @RequestParam (defaultValue = "user") String table
		) {
		String userNum = autoNumService.autoNum1(sep, column, len, table);
		//Map<String, String> map = Collections.singletonMap("userNum", next);
		
		System.out.println(Collections.singletonMap("userNum", userNum));
		return Collections.singletonMap("userNum", userNum);
	}
	*/
	@PostMapping(value = "userWrite", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> userWrite1(@RequestBody UserCommand userCommand) {
		System.out.println(userCommand);
		Boolean insertResult = userWriteService.userWrite(userCommand);
		if(insertResult) {
			// 200 ok + {success:ture} JSON 객체 전달
			return ResponseEntity.ok(Collections.singletonMap("success", true)); //성공 JSON, redirect: 200ok
		} else {
			// 500 (또는 400 ) -> 프론트가 예외처리 가능
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Collections.singletonMap("insert_error", false)); // 실패 JSON
		}
	}
	@GetMapping("userList")
	public UserListResponse userList(@RequestParam (defaultValue = "1") int page
			, @RequestParam (defaultValue = "10") int limitRow
			, @RequestParam (required = false) String searchWord
			, @RequestParam (required = false) String kind
			, @RequestParam (required = false) String kind2
			, Model model) {
		return userListService.userList2(page, limitRow, searchWord, kind, kind2);
	}
	@GetMapping("userDetail")
	public String userDetail(@RequestParam String userNum, Model model) {
		userDetailService.userDetail(userNum, model);
		return "thymeleaf/user/userDetail";
	}
	@GetMapping("userUpdate")
	public String userUpdate(@RequestParam String userNum, Model model) {
		userDetailService.userDetail(userNum, model);
		return "thymeleaf/user/userUpdate";
	}
	@PostMapping("userUpdate")
	public String userUpdate1(UserCommand userCommand) {
		userUpdateService.userUpdate(userCommand);
		return "redirect:/admin/user/userList";
	}
	
	@Autowired
	UserMapper userMapper;
	@GetMapping("userDelete")
	public String userDelete(@RequestParam String userNum) {
		userMapper.userDelete(userNum);
		return "redirect:/admin/user/userList";
	}

}
