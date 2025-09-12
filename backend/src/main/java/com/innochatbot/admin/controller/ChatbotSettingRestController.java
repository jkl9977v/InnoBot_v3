package com.innochatbot.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.admin.command.ChatbotCommand;
import com.innochatbot.admin.dto.ChatbotDTO;
import com.innochatbot.admin.service.chatBot.ChatbotDetailService;
import com.innochatbot.admin.service.chatBot.ChatbotSettingService;

@RestController
@RequestMapping("/admin")
public class ChatbotSettingRestController {
	
	@Autowired
	ChatbotDetailService chatbotDetailService;
	
	@Autowired
	ChatbotSettingService chatbotSettingService;
	
	@GetMapping("chatbot-setting")
	public ResponseEntity<ChatbotDTO> chatbotSetting1(/* String settingId */){
		//서비스에 있는 dto를 반환하는 메서드 사용
		ChatbotDTO dto = chatbotDetailService.returnDTO();
		if (dto == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(dto);
	}
	
	@PostMapping("chatbot-setting")
	public ResponseEntity<String> saveChatbotSetting1(@RequestBody ChatbotCommand chatbotCommand) {
		chatbotSettingService.settingUpdate(chatbotCommand);
		return ResponseEntity.ok("저장 완료");
	}
}
