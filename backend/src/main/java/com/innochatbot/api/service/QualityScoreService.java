package com.innochatbot.api.service;

import org.springframework.stereotype.Service;

@Service
public class QualityScoreService { //문장 품질 점수 측정 (간단버전)
	
	// 0-100점 반환
	public int score(String sentence) {
		if (sentence == null) return 0;
		
		String text = sentence.trim();
		int len = text.length();
		
		// 1) 기본 가산점
		int score = 100;
		
		// 2) 너무 짧으면 감점
		if (len < 20) score -= 40;
		else if (len <35) score -= 20;
		
		// 3) 숫자*기호 비율 감점
		int digit = 0, symbol = 0;
		for (char c : text.toCharArray()) {
			if (Character.isDigit(c)) digit++;
			else if (!Character.isLetter(c) && !Character.isWhitespace(c)) symbol ++;
		}
		double digitRatio = (double) digit / Math.max(1, len);
		double symbolRatio = (double) symbol / Math.max(1, len);
		
		if (digitRatio > 0.4) score -= 30;
		if (symbolRatio > 0.3) score -= 20;
		
		// 4) 한글*영문 자모가 10자 미만이면 감점
		long alphaCnt = text.chars().filter(Character::isLetter).count();
		if (alphaCnt < 10) score -= 20;
		
		//하한선
 		return Math.max(0, score);
	}
}
