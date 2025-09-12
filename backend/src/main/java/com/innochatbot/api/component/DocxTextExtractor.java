package com.innochatbot.api.component;

import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;

import com.innochatbot.api.service.TextExtractor;

/**
 * [역할] .docx에서 문단/표 텍스트 추출
 * [이유] Word 문서에 저장된 텍스트를 임베딩 대상 텍스트로 변환
 */
@Component
public class DocxTextExtractor implements TextExtractor {
	@Override
	public String extract(Path file) throws Exception{
		try (var is = Files.newInputStream(file);
			var doc = new XWPFDocument(is)){
			StringBuilder sb = new StringBuilder();
			
			//문단
			doc.getParagraphs().forEach(p -> sb.append(p.getText()).append("\n"));
			
			//표(셀 텍스트)
			doc.getTables().forEach(t->
			t.getRows().forEach(r -> {
				r.getTableCells().forEach(c -> sb.append(c.getText()).append("\t"));
				sb.append("\n");
			})
		);
		return sb.toString(); 
		}
	}
	
	@Override
	public String getExtension() {
		return "docx";
	}
}
