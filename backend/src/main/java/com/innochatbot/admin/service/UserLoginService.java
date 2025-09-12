package com.innochatbot.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.command.LoginCommand;
import com.innochatbot.admin.dto.LoginDTO;
import com.innochatbot.admin.mapper.LoginMapper;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Service
public class UserLoginService {
	@Autowired
	LoginMapper loginMapper;

	public Boolean adminLogin(LoginCommand loginCommand
			, HttpSession session, HttpServletResponse response) {
		//세션, 쿠키
		LoginDTO loginSession = loginMapper.userIdSelectOne(loginCommand.getUserId());
		Boolean LoginStatus=false;
		if(loginSession != null) { //아이디 있음, 로그인 진행
			if(loginSession.getManager().equals("y")) {
				// ++ 등급에 따라 로그인 가능하게 하는 절차도 필요.
				// 왜냐하면 아무 사용자가 다 로그인 가능하면 안되기 때문
				if(loginSession.getUserPw().equals(loginCommand.getUserPw())) {
					//비밀번호가 일치
					System.out.println(loginSession.getUserId() + " 로그인 성공");
					session.setAttribute("loginSession", loginSession);
					System.out.println("session Id"+ session.getId());
					
					LoginStatus=true;
				}else {
					//비밀번호 불일치
					System.out.println("비밀번호가 일치하지 않습니다. 로그인 실패");
				}
			}else {
				System.out.println("관리자가 아닙니다. 관리자 이외에는 로그인 할 수 없습니다.");
			}
		}else { // 아이디 없음, 로그인 실패
			System.out.println("아이디가 존재하지 않습니다. 로그인 실패");
		}
		return LoginStatus;
		
	}

}
