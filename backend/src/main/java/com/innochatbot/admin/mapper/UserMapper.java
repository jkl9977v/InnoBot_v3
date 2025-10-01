package com.innochatbot.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.dto.UserDTO;

@Mapper
public interface UserMapper {

	public int userInsert(UserDTO dto);

	public List<UserDTO> userList(StartEndPageDTO dto);

	public UserDTO userDetail(String userNum);

	public void userDelete(String userNum);

	public int userUpdate(UserDTO dto);

	public Integer userCount();

}
