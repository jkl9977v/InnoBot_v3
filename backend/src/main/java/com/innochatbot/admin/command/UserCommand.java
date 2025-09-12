package com.innochatbot.admin.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCommand {
	String userNum;
	String userId;
	String userPw;
	String gradeId;
	String departmentId;
	String userName;
	
	String manager;
}

