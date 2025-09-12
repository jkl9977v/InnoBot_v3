package com.innochatbot.admin.command;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("loginCommand")
public class LoginCommand {
	String userId;
	String userPw;
}
