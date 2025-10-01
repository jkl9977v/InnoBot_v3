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

	public UserDTO userDetail(String userNum) {
		UserDTO dto=userMapper.userDetail(userNum);
		return dto;
	}

}
