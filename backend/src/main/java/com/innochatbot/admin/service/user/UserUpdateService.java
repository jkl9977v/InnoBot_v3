package com.innochatbot.admin.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.UserCommand;
import com.innochatbot.admin.dto.UserDTO;
import com.innochatbot.admin.mapper.UserMapper;

@Service
public class UserUpdateService {
	@Autowired
	UserMapper userMapper;

	public void userUpdate(UserCommand userCommand) {
		UserDTO dto = new UserDTO();
		
		dto.setUserId(userCommand.getUserId());
		dto.setUserName(userCommand.getUserName());
		dto.setUserNum(userCommand.getUserNum());
		dto.setUserPw(userCommand.getUserPw());
		dto.setDepartmentId(userCommand.getDepartmentId());
		dto.setGradeId(userCommand.getGradeId());
		if(userCommand.getManager()==null || userCommand.getManager()=="") {
			dto.setManager("n");
		}else dto.setManager(userCommand.getManager());
		
		userMapper.userUpdate(dto);
		
	}
	
}
