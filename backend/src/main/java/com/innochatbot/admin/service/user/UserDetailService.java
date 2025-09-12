package com.innochatbot.admin.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.UserDTO;
import com.innochatbot.admin.mapper.UserMapper;

@Service
public class UserDetailService {
	@Autowired
	UserMapper userMapper;

	public void userDetail(String userNum, Model model) {
		UserDTO dto = new UserDTO();
		dto=userMapper.userDetail(userNum);
		model.addAttribute("dto", dto);
		System.out.println(dto);
		
	}

}
