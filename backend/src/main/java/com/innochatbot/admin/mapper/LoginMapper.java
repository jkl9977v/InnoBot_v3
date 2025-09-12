package com.innochatbot.admin.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.innochatbot.admin.dto.LoginDTO;

@Mapper
public interface LoginMapper {
	
	public LoginDTO userIdSelectOne(String userId); 

	

}
