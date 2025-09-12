package com.innochatbot.api.component;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.stereotype.Component;

import com.innochatbot.api.service.TextExtractor;

@Component
public class TxtTextExtractor implements TextExtractor {
	
	@Override
	public String extract(Path filePath) throws Exception {
		String text = String.join("\n", Files.readAllLines(filePath, StandardCharsets.UTF_8));
		return text;
	}
	
	@Override
	public String getExtension() {
		return "txt";
	}

}
