package com.innochatbot.api.service;

import java.nio.file.Path;

public interface TextExtractor { //텍스트를 뽑는 방식은 extract(filePath)를 통해서 이루어짐
	public String extract(Path filePath) throws Exception;
	public String getExtension();
}
