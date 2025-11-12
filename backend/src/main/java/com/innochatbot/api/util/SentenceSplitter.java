package com.innochatbot.api.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.BreakIterator;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;

public final class SentenceSplitter {
	private SentenceSplitter() {}
	
	public static List<String> split(String text) { // apache 문장분리기 사용
		// .bin 파일이 있어야 사용 가능함 (현재는 없음)
		List<String> sentences = new ArrayList<>();
		
		try (InputStream modelIn = new FileInputStream("models/ko-sent.bin")) {
			SentenceModel model = new SentenceModel(modelIn);
			SentenceDetectorME detector = new SentenceDetectorME(model);
			
			String[] detected = detector.sentDetect(text);
			
			for (String s : detected) {
				String trimmed = s.trim();
				if(!trimmed.isEmpty()) sentences.add(trimmed);
			}
			
		} catch (IOException e) {
			throw new RuntimeException("Sentence detection failed", e);
		}
		
		return sentences;
	}
	
	public static List<String> breakInterator(String text, Locale locale) {
		if(text == null || text.isEmpty()) return Collections.emptyList();
		
		BreakIterator iterator = BreakIterator.getSentenceInstance(locale);
		iterator.setText(text);
		
		List<String> sentences = new ArrayList<>();
		int start = iterator.first();
		
		for(int end = iterator.next(); end != BreakIterator.DONE;
				start = end, end = iterator.next()) {
			String sentence = text.substring(start, end).trim();
			if (!sentence.isEmpty()) sentences.add(sentence);
		}
		return sentences;
		
	}

}
