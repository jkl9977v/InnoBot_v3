package com.innochatbot.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.admin.dto.LoginDTO;
import com.innochatbot.admin.dto.UserDTO;
import com.innochatbot.admin.mapper.UserMapper;
import com.innochatbot.admin.service.ListPageService;
import com.innochatbot.admin.service.UserLoginService;
import com.innochatbot.admin.service.filePath.FilePathListService;

import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RequestMapping("admin")
@RestController
public class AdminRestController {

    @Autowired
    FilePathListService filePathListService;
    @Autowired
    UserLoginService userLoginService;
    @Autowired
    ListPageService listPageService;
    
    @Autowired
    UserMapper userMapper;
    
    @GetMapping("getHeader")
	public ResponseEntity<?> getHeader(/* HttpServletResponse response, */ 
	/* HttpSession session */
			HttpServletRequest request) {
    	//세션이 없으면 null을 반환한다.
    	HttpSession session = request.getSession(false);
    	if(session == null) {
    		return ResponseEntity.noContent().build(); //204
    	}
    	
    	LoginDTO loginSession = (LoginDTO) session.getAttribute("loginSession");
    	System.out.println("loginSession: "+ loginSession);
    	if (loginSession != null) {
    		try {
    			loginSession.setUserPw(null); //비밀번호 유출 방지
    			UserDTO dto = userMapper.userDetail(loginSession.getUserNum());
    			dto.setUserPw(null);
    			/*
    			Map<String, Object> result = new HashMap<>();
    			result.put("userDTO", dto);
    					Map.of("userNum", dto.getUserNum()
    							,"userId", dto.getUserId(), "userName", dto.getUserName()
    					, "departmentName", dto.getDepartmentDTO().getDepartmentName()
    					, "gradeName", dto.getGradeDTO().getGradeName());
    			*/
    			System.out.println(dto);
    			return ResponseEntity.ok(dto);
    		} catch (Exception e) { //직렬화 문제, 캐스팅 문제 발생 시 로그인 없음으로 처리
    			return ResponseEntity.noContent().build();
    		}
    	}else //로그인 안 된 경우: 204 No Content 반환
    		return ResponseEntity.noContent().build();
    }

}
