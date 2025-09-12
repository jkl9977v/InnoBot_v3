package com.innochatbot.api.component;

import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.stereotype.Component;

import com.innochatbot.api.service.TextExtractor;

/**
 * [역할] .csv 라인 텍스트 추출
 * [이유] 표 데이터를 빠르게 텍스트화(필요시 구분자/인코딩/따옴표 처리 고도화 가능)
 */
@Component
public class CsvTextExtractor implements TextExtractor{
	@Override
	public String extract(Path file) throws Exception{
		StringBuilder sb = new StringBuilder();
		try (var reader = Files.newBufferedReader(file)){ //인코딩 이슈 있으면 감지 라이브러리 사용
			String line;
			while((line = reader.readLine()) != null) {
				sb.append(line).append("\n");
			}
		}
		return sb.toString();
	}
	
	@Override
	public String getExtension() {
		return "csv";
	}
}
