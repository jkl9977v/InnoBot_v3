package com.innochatbot.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.innochatbot.admin.command.UserCommand;
import com.innochatbot.admin.mapper.UserMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.admin.service.user.UserDetailService;
import com.innochatbot.admin.service.user.UserListService;
import com.innochatbot.admin.service.user.UserUpdateService;
import com.innochatbot.admin.service.user.UserWriteService;

@Controller
@RequestMapping("admin/user")
public class UserController {
	@Autowired
	AutoNumService autoNumService;
	@Autowired
	UserWriteService userWriteService;
	@Autowired
	UserListService userListService;
	@Autowired
	UserDetailService userDetailService;
	@Autowired
	UserUpdateService userUpdateService;
	
	@GetMapping("userWrite")
	public String userWrite(UserCommand userCommand
		, @RequestParam (defaultValue = "user_") String sep
		, @RequestParam (defaultValue = "user_num") String column
		, @RequestParam (defaultValue = "6") int len
		, @RequestParam (defaultValue = "user") String table
		, Model model) {
		userCommand.setUserNum(autoNumService.autoNum1(sep, column, len, table));
		model.addAttribute("command", userCommand);
		return "thymeleaf/user/userWrite";
	}
	@PostMapping("userWrite")
	public String userWrite1(UserCommand userCommand) {
		userWriteService.userWrite(userCommand);
		return "redirect:/admin/user/userList";
	}
	@GetMapping("userList")
	public String userList(@RequestParam (defaultValue = "1") int page
			, @RequestParam (defaultValue = "10") int limitRow
			, @RequestParam (required = false) String searchWord
			, @RequestParam (required = false) String kind
			, @RequestParam (required = false) String kind2
			, Model model) {
		userListService.userList(page, limitRow, searchWord, kind, model, kind2);
		return "thymeleaf/user/userList";
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
