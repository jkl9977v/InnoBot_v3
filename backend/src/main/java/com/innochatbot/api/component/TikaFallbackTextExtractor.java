package com.innochatbot.api.component;
import java.nio.file.Path;

import org.apache.tika.Tika;
import org.springframework.stereotype.Component;

import com.innochatbot.api.service.TextExtractor;

/**
 * [역할] 등록되지 않은 확장자를 "최대한" 텍스트로 변환 시도
 * [이유] 확장자 누락/예외 케이스에서 빠르게 대응(정밀 제어는 전용 추출기에서)
 */
@Component
public class TikaFallbackTextExtractor implements TextExtractor{
	private final Tika tika = new Tika();
	
	@Override
	public String extract(Path file) throws Exception{
		return tika.parseToString(file.toFile());
	}
	
	@Override
	public String getExtension() {
		return "fallback"; //또는 * (모든 확장자)
	}

}
