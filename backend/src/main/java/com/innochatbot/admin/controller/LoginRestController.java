package com.innochatbot.admin.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.admin.command.LoginCommand;
import com.innochatbot.admin.dto.LoginDTO;
import com.innochatbot.admin.service.UserLoginService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
public class LoginRestController {
	@Autowired
	UserLoginService userLoginService;
    
    /**
     * POST /login
     * - JSON 또는 form-urlencoded 둘 다 받을 수 있게 처리합니다.
     * - 성공: 200 OK + { success: true, user: {..} }
     * - 실패: 401 Unauthorized
     *
     * 사용법:
     * - JSON: { "username": "...", "password": "..." } (Content-Type: application/json)
     * - Form: username=...&password=... (Content-Type: application/x-www-form-urlencoded)
     */
    @PostMapping("login")
    public ResponseEntity<?> login1(
    		//LoginCommand loginCommand, HttpSession session, HttpServletResponse response
    		HttpServletRequest request, HttpSession session, HttpServletResponse response,
    		@RequestBody(required=false) Map<String,Object> jsonBody
    		, @RequestParam(required=false) Map<String, Object> formParams) {
    	
    	//1) 입력 추출 userId, userPw
    	String userId = jsonBody.get("userId") != null ? String.valueOf(jsonBody.get("userId")) : null;
    	String userPw = jsonBody.get("userPw") != null ? String.valueOf(jsonBody.get("userPw")) : null;
    	
    	if(userId == null || userPw == null) {
    		Map<String, Object> err = new HashMap<>();
    		err.put("success", false);
    		err.put("message", "아이디와 비밀번호를 입력헤주세요.");
    		return ResponseEntity.badRequest().body(err);
    	}
    	session = request.getSession(true);
    	LoginCommand loginCommand = new LoginCommand();
    	loginCommand.setUserId(userId);
    	loginCommand.setUserPw(userPw);
    	//로그인 처리 과정
    	Boolean LoginStatus = userLoginService.adminLogin(loginCommand, session, response);
    	if(LoginStatus) { //LoginStatus가 true. 일때
    		LoginDTO loginSession = (LoginDTO) session.getAttribute("loginSession");
    		if(loginSession != null) loginSession.setUserPw(null); //민감정보 제거
    		Map<String, Object> resp = new HashMap<>();
    		resp.put("success", true);
    		resp.put("user", loginSession);
    		return ResponseEntity.ok(resp);
    	}
    	else {
    		Map<String, Object> resp = new HashMap<>();
    		resp.put("success", false);
    		resp.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
    	}
    	
    }
    
    //로그아웃
    @PostMapping("logout")
    @ResponseBody
    public ResponseEntity<?> logout(HttpServletRequest request, HttpSession session) {
    	session = request.getSession(false);
    	if(session != null) session.invalidate();
    	Map<String, Object> resp = new HashMap<>();
    	resp.put("success", true);
    	resp.put("message", "로그아웃 되었습니다.");
    	return ResponseEntity.ok(resp);
    }
    
    //로그아웃
    @GetMapping("logout")
    @ResponseBody
    public ResponseEntity<?> logout1(HttpServletRequest request, HttpSession session) {
    	session = request.getSession(false);
    	if(session != null) session.invalidate();
    	Map<String, Object> resp = new HashMap<>();
    	resp.put("success", true);
    	resp.put("message", "로그아웃 되었습니다.");
    	return ResponseEntity.ok(resp);
    }
}
