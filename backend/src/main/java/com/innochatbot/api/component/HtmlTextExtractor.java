package com.innochatbot.api.component;

import java.nio.file.Path;

import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;

import com.innochatbot.api.service.TextExtractor;

/**
 * [역할] .html의 본문 텍스트만 추출(스크립트/스타일 제거)
 * [이유] 웹문서에서 임베딩에 불필요한 노이즈 제거 후 본문만 사용
 */
@Component
public class HtmlTextExtractor implements TextExtractor{
	@Override
	public String extract(Path file) throws Exception{
		var doc = Jsoup.parse(file.toFile(), null);
		doc.select("script, style, noscript").remove();
		return doc.text();
	}
	
	@Override
	public String getExtension() {
		return "html"; //"htm";
	}

}
