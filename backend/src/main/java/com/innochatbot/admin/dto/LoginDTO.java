package com.innochatbot.admin.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("loginDTO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDTO {
	String userNum;
	String userId;
	String userPw;
	String departmentId;
	String gradeId;
	
	String manager;
}
