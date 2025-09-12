package com.innochatbot.admin.command;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatbotCommand {
	
	//관리자페이지 설정
	String settingId;
	String path; //기준경로
	int hour;
	int min;
	
	//확장자
	String txt;
	String pdf;
	String docx;
	String xlsx;
	String pptx;
	String html;
	String cvs;
	String tika;
	
	//챗봇 대화설정
	String answerModel; //답변 모델
	String anserOption; //답변 옵션 (1. 청크 2. 파일이름+청크 3. 파일이름 -> 청크)
	
	//String embeddingModel;
	//String refreshCycleMin;
	

}

