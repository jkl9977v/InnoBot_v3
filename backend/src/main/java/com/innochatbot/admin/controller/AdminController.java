package com.innochatbot.admin.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.innochatbot.admin.command.ChatbotCommand;
import com.innochatbot.admin.dto.LoginDTO;
import com.innochatbot.admin.dto.UserDTO;
import com.innochatbot.admin.mapper.UserMapper;
import com.innochatbot.admin.service.ListPageService;
import com.innochatbot.admin.service.UserLoginService;
import com.innochatbot.admin.service.chatBot.ChatbotDetailService;
import com.innochatbot.admin.service.chatBot.ChatbotSettingService;
import com.innochatbot.admin.service.filePath.FilePathListService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RequestMapping("admin")
@Controller
public class AdminController {


    @Autowired
    FilePathListService filePathListService;
    @Autowired
    UserLoginService userLoginService;
    @Autowired
    ListPageService listPageService;
    
    @RequestMapping("")
    public String main(HttpServletRequest request) {
    	HttpSession session = request.getSession(false);
    	if(session != null && session.getAttribute("loginSession") != null) {
    		return "redirect:/admin/file";
    	}
    	return "redirect:/admin/login";
    }
    @RequestMapping("/")
    public String main1(HttpServletRequest request) {
    	HttpSession session = request.getSession(false);
    	if(session != null && session.getAttribute("loginSession") != null) {
    		return "redirect:/admin/file";
    	}
    	return "redirect:/admin/login";
    }

    
    
    @GetMapping("file")
    public String adminMain() {
    	return "redirect:/admin/file/fileList";
    }
    @GetMapping("user")
    public String user() {
    	//유저 설정(유저 추가/부서/직급)
    	return "redirect:/admin/user/userList";
    }
    @GetMapping("accessRule") //접근권한 규칙 설정
    public String accessRule(
    		) {
        return "redirect:/admin/accessRule/accessList";
    }
    @Autowired
    UserMapper userMapper;
    
    @GetMapping("getHeader")
    @ResponseBody
	public ResponseEntity<?> getHeader(/* HttpServletResponse response, */ 
    		HttpSession session) {
    	LoginDTO loginSession = (LoginDTO) session.getAttribute("loginSession");
    	System.out.println(loginSession);
    	if (loginSession != null) {
    		try {
    			loginSession.setUserPw(null); //비밀번호 유출 방지
    			UserDTO dto = userMapper.userDetail(loginSession.getUserNum());
    			Map<String, Object> result = new HashMap<>();
    			result.put("user", dto);
    					/*Map.of("userId", dto.getUserId(), "userName", dto.getUserName()
    					, "departmentName", dto.getDepartmentDTO().getDepartmentName()
    					, "gradeName", dto.getGradeDTO().getGradeName());*/
    			return ResponseEntity.ok(result);
    		} catch (Exception e) { //직렬화 문제, 캐스팅 문제 발생 시 로그인 없음으로 처리
    			return ResponseEntity.noContent().build();
    		}
    	}else //로그인 안 된 경우: 204 No Content 반환
    		return ResponseEntity.noContent().build();
    }
    
    @GetMapping("getMain2")
    public String getMain2() {
    	return "thymeleaf/getAll/getMain2";
    }
    @GetMapping("chatbot2")
    public String chatbot() {
    	return "thymeleaf/main";
    }
    @Autowired
    ChatbotSettingService chatbotSettingService;
    @Autowired
    ChatbotDetailService chatbotDetailService;
    
    /*
    @GetMapping("chatbot-setting")
    public String chatbotSetting(String settingId ,Model model) {
    	chatbotDetailService.chatbotDetail(settingId, model);
    	return "thymeleaf/chatbot/chatbotSetting";
    }
    
    @PostMapping("chatbot-setting")
    //@ResponseBody 
	public /*ResponseEntity<String> String saveSetting(/* @RequestBody  ChatbotCommand chatbotCommand) {
    	chatbotSettingService.settingUpdate(chatbotCommand);
        //return ResponseEntity.ok("저장 완료");
    	return "redirect:/admin/";
    }
	*/


}
