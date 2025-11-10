package com.innochatbot.api.dto;

import java.util.List;

public interface Preprocessor { //정제 틀
	String clean(String raw); //불필요한 문자 제거
	List<String> split(String cleaned); // 문자 단위로 분리
	List<String> removeDuplicates(List<String> sentences); //중복 제거
}
