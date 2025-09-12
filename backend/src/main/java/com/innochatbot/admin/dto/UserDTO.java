package com.innochatbot.admin.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("userDTO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
	String userNum;
	String userId;
	String userPw;
	String gradeId;
	String departmentId;
	String userName;
	
	String manager;
	
	GradeDTO GradeDTO;
	DepartmentDTO DepartmentDTO;
}
