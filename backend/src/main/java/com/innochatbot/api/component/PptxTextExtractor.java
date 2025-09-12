package com.innochatbot.api.component;

import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.springframework.stereotype.Component;

import com.innochatbot.api.service.TextExtractor;

/**
 * [역할] .pptx 슬라이드의 텍스트 상자 내용 추출
 * [이유] 발표자료의 본문을 임베딩에 활용
 */
@Component
public class PptxTextExtractor implements TextExtractor{
	@Override
	public String extract(Path file) throws  Exception{
		try (var is = Files.newInputStream(file);
			var ppt = new XMLSlideShow(is)) {
			StringBuilder sb = new StringBuilder();
			int idx = 1;
			for(var slide : ppt.getSlides()) {
				sb.append("[SLIDE ").append(idx++).append("]\n");
				slide.getShapes().forEach(shape -> {
					if(shape instanceof XSLFTextShape ts) {
						sb.append(ts.getText()).append("\n");
					}
				});
				sb.append("\n");
			}
			return sb.toString();
		}
		
	}
	
	@Override
	public String getExtension() {
		return "pptx";
	}
}
