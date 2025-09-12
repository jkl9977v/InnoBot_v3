package com.innochatbot.admin.mapper;

//import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.innochatbot.admin.dto.ChatbotDTO;

@Mapper
public interface ChatbotMapper {

	//public Optional<ChatbotDTO> findById(String string);

	public void botSettingUpdate(ChatbotDTO dto);

	public ChatbotDTO ChatbotDetail(String settingId);

}
