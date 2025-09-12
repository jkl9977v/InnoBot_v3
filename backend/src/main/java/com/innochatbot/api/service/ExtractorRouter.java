package com.innochatbot.api.service;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.innochatbot.api.component.CsvTextExtractor;
import com.innochatbot.api.component.DocxTextExtractor;
import com.innochatbot.api.component.HtmlTextExtractor;
import com.innochatbot.api.component.PdfTextExtractor;
import com.innochatbot.api.component.PptxTextExtractor;
import com.innochatbot.api.component.TikaFallbackTextExtractor;
import com.innochatbot.api.component.TxtTextExtractor;
import com.innochatbot.api.component.XlsxTextExtractor;

@Service
public class ExtractorRouter {
	
	//등록된 추출기들(필요한 것부터 점진적으로 추가)
	private final Map<String, TextExtractor> handlers = new HashMap<>();
	
	//핸들러가 없을 때 텍스트 추출
	private final TextExtractor fallback;
	
	public ExtractorRouter(
		PdfTextExtractor pdf,
		TxtTextExtractor txt,
		DocxTextExtractor docx,
		PptxTextExtractor pptx,
		XlsxTextExtractor xlsx,
		CsvTextExtractor csv, 
		HtmlTextExtractor html,
		TikaFallbackTextExtractor fallback //등록
	) {
		//확장자 -> 핸들러 매핑
		handlers.put("pdf", pdf);
		handlers.put("txt", txt);
		handlers.put("docx", docx);
		handlers.put("pptx", pptx);
		handlers.put("xlsx", xlsx);
		handlers.put("csv", csv);
		handlers.put("html", html);
		handlers.put("htm", html);
		
		this.fallback = fallback;
	}
	
	 /**
     * [기능] 파일 확장자를 보고 적절한 추출기를 호출한다.
     * [정책] 등록되지 않은 확장자는 fallback으로 처리(가능한 한 텍스트를 뽑아보는 전략).
     */
	public String extract(Path file) throws Exception{
		String ext = getExtension(file);
		TextExtractor ex = handlers.getOrDefault(ext, fallback);
		return ex.extract(file);
	}
	
	//유틸 : 확장자 추출
	private String getExtension(Path p) {
		String name = p.getFileName().toString();
		int dot = name.lastIndexOf('.');
		return (dot >=0 ) ? name.substring(dot + 1).toLowerCase() : "";
	}
	
	
	
}
