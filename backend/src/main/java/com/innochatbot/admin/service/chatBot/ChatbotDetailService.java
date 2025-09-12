package com.innochatbot.admin.service.chatBot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.ChatbotDTO;
import com.innochatbot.admin.mapper.ChatbotMapper;

@Service
public class ChatbotDetailService {
	@Autowired
	ChatbotMapper chatbotMapper;
	
	public void chatbotDetail(String settingId, Model model) {
		settingId = "setting_000000001"; //임시용
		ChatbotDTO dto = chatbotMapper.ChatbotDetail(settingId);
		System.out.println(dto);
		model.addAttribute("dto", dto);
	}
	
	public ChatbotDTO returnDTO() {
		String settingId = "setting_000000001";
		ChatbotDTO dto = chatbotMapper.ChatbotDetail(settingId);
		return dto;
	}
	

}
