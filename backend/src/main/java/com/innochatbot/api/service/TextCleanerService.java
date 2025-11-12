package com.innochatbot.api.service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.innochatbot.api.dto.Preprocessor;

@Service
public class TextCleanerService implements Preprocessor{ //텍스트 추출 후 정제 (기본 정제) 
	
	@Override
	public String clean(String text) {	// 불필요한 문자 제거
		String refinedText = text;
		
		
		refinedText = refinedText
				.replaceAll("[\\x00-\\x1F\\x7F\\u200B\\t]+", " "); // 제어문자/탭/비가시 문자 제거
		refinedText = refinedText
				.replaceAll("[※★▶▣◆◇•○●■□▽▲▶▷✅]", " "); // 특수 기호 / 불필요한 문자 제거
		refinedText = refinedText
				.replaceAll("[^\\p{L}\\p{N}\\p{P}\\p{Z}\\n]", " "); // 이모지/비문자 제거 (한글, 영문, 숫자, 구두점, 공백, 개행만 유지)
		//중복 구두점 축약
		refinedText = refinedText
				.replaceAll("(\\.{2,})", ".") // .. → .
				.replaceAll("!{2,}", "!") // !!! → !
				.replaceAll("\\?{2,}", "?") // ?? → ?
				.replaceAll("[-_]{2,}", "-"); // --, __ → -
		
		refinedText = refinedText
				.replaceAll("(?m)^[=\\-#]{3,}$", ""); //ASCII아트, 표 기호 제거
		refinedText = refinedText
				.replaceAll("\\s+", " ").trim(); //공백 제거
		 
		/*
		s = s.replaceAll("(?m)^\\s*Page\\s*\\d+\\s*(/\\s*\\d+)?\\s*$", "");  // 문서의 페이지 번호 줄을 지운다.
		s = s.replaceAll("(?i)(?m)^목차\\s*$", "");	// "목차" 단독 줄 제거
		s = s.replaceAll("(?i)(?m)^(copyright|저작권).*$", ""); // 본 문서는 ... 저작권/법적 문구 제거
		s = s.replaceAll("[\\t ]{2,}", " ");	//공백 탭 다중 -> 단일화
	    s = s.replaceAll("(?m)^[ \\t]*\\r?\\n", "");	// 앞뒤 공백 제거 (" 내용 " -> "내용"), 빈 줄 제거
	    s = s.replaceAll("(?m)^[0-9]{1,3}\\s*$", "");	// 3글자 이하 숫자만 있는 줄 제거
	    */
	    return refinedText;	
	}

	@Override
	public List<String> split(String cleaned) {	 //문장 단위로 분리
		// 1️⃣ 줄 단위 split (모든 종류의 줄바꿈 대응)
		String[] rawLines = cleaned.split("\\R", -1); // -1: 마지막 빈 줄까지 보존

		// 2️⃣ 각 줄을 문장부호 기준으로 분리 (기존 정규식 유지)
		List<String> rawSentences = new ArrayList<>();
		for (String line : rawLines) {
		    //if (line == null || line.isEmpty()) continue;
		    String[] sentences = line.split("(?<=[.!?])(?!\\s*[a-zA-Z0-9/:])(?<!\\d\\.)");
		    Collections.addAll(rawSentences, sentences);
		}
		System.out.printf("[2단계] 문장 분리 후 개수: %d%n", rawSentences.size());

		// 3️⃣ 문장 리스트에서 공백·빈 줄 정규화 후 제거
		List<String> out = rawSentences.stream()
		        .map(TextCleanerService::normalizeForBlankCheck) // NBSP/전각/제로폭/제어문자 제거 + trim
		        .filter(s -> !s.isEmpty())                       // ✅ 진짜 빈 줄 제거
		        .toList();

		System.out.printf("[2단계] 빈 줄 제거 후 문장 수: %d → %d (%d개 제거)%n",
		        rawSentences.size(), out.size(), rawSentences.size() - out.size());

		return out;
	}
	
	/** 빈 줄 판단용 정규화: NBSP/전각공백/제로폭/제어문자 제거 후 trim */
	private static String normalizeForBlankCheck(String s) {
	    if (s == null) return "";
	    return s
	            .replace('\u00A0', ' ')               // NBSP → space
	            .replace('\u3000', ' ')               // 전각 공백 → space
	            .replace("\u200B", "")                // zero-width space
	            .replace("\u200C", "")                // ZWNJ
	            .replace("\u200D", "")                // ZWJ
	            .replace("\uFEFF", "")                // BOM
	            .replaceAll("[\\u0000-\\u001F\\u007F]", "") // 제어문자 제거
	            .trim();
	}
	
	// 문장 리스트에서 중복 문장을 제거함
	// 대소문자 무시, 앞뒤 공백 제거 후 비교함
	@Override
	public List<String> removeDuplicates(List<String> sentences) {	
		//내용이 없을 경우 빈 리스트 => 빈 리스트는 임베딩 대상에서 제거
		if(sentences == null || sentences.isEmpty()) return Collections.emptyList(); 
		
		Set<String> seen = new LinkedHashSet<>();
		List<String> result = new ArrayList<>();
		
		//문장 개수만큼 반복처리
		for(String sentence : sentences) {
			// 유니코드 정규화(전각/호환문자 통일)
			//String normalized = Normalizer.normalize(sentence, Normalizer.Form.NFKC);
			
			//주석 프리픽스 정규화 (필요 없으면 주석처리)
			//normalized = normalized.replaceAll("^\\s*//+\\s*", "// ");
			
			/*
			//비교 기준 확정
			normalized = normalized.trim().toLowerCase(Locale.ROOT);
			 
			if (seen.add(normalized)) {
				result.add(sentence.trim()); //원문은 최대 보존(앞뒤만 정리함) 
			}
			*/
			String key = sentence.trim().toLowerCase(Locale.ROOT);   // 비교용 키 (간단)

	        if (!seen.add(key)) {
	            //System.out.println("[중복-제거] " + sentence);       // ← ★ 이 한 줄 : 빠지는 문장 출력
	            continue;                                     // 중복이면 skip
	        }
	        result.add(sentence.trim());
		}
		return result; 
	}
}

//CR 제거, 보이지 않는 공백류를 공백 1개로 축소
/*
normalized = normalized
		   //.replace("\r", "") 	//CR 제거
		   //.replace("\n", "")	//LF 제거
		   .replace('\u00A0',' ')   // NBSP
           .replace('\u3000',' ')   // 전각 공백
           .replace("\u200B","")    // zero-width space
           .replaceAll("\\s+", " ");\
           */
/* 이전버전
//비교 기준: 소문자 + trim (앞뒤 공백제거, 전부 소문자화)
//String normalized = sentence.trim().toLowerCase();

//이미 본 문장이 아니면 추가
if (!seen.contains(normalized)) {
	seen.add(normalized);
	result.add(sentence.trim());
} 


Set<Integer> seen = new HashSet<>();
List<String> out = new ArrayList<>();
for (String u : sentences) { 
	int h = u.hashCode();
	if (seen.add(h)) out.add(u);
}
return out;

 */