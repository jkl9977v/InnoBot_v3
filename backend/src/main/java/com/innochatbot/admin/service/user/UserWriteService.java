package com.innochatbot.admin.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.UserCommand;
import com.innochatbot.admin.dto.UserDTO;
import com.innochatbot.admin.mapper.UserMapper;
import com.innochatbot.admin.service.AutoNumService;

@Service
public class UserWriteService {
	@Autowired
	UserMapper userMapper;
	@Autowired
	AutoNumService autoNumService;

	public Boolean userWrite(UserCommand userCommand) {
		UserDTO dto = new UserDTO();
		
		//유저번호 생성
		String sep = "user_";
		String column = "user_num";
		int len = 6;
		String table = "user";
		
		String userNum = autoNumService.autoNum1(sep, column, len, table);
		
		dto.setUserNum(userNum);
		dto.setUserId(userCommand.getUserId());
		dto.setUserName(userCommand.getUserName());
		dto.setUserPw(userCommand.getUserPw());
		dto.setDepartmentId(userCommand.getDepartmentId());
		dto.setGradeId(userCommand.getGradeId());
		if(userCommand.getManager()==null || userCommand.getManager()=="") {
			dto.setManager("n");
		}else dto.setManager(userCommand.getManager());
			
		int insertResult = userMapper.userInsert(dto); //서버 입력 성공 시 insertResult는 1임 (1행 삽입 성공)
		
		return insertResult == 1; // 1행 삽입 성공 시 true
		
	}

}
