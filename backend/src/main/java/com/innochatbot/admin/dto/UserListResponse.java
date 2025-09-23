package com.innochatbot.admin.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Alias("userListResponse")
public class UserListResponse {
	
	PageResponse<UserDTO> users;		//페이지 정보 + 사용자 목록
	List<DepartmentDTO> departments;	//부서 옵션
	List<GradeDTO> grades; 				//직급 옵션

}
