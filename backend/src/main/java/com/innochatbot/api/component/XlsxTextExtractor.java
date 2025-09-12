package com.innochatbot.api.component;

import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import com.innochatbot.api.service.TextExtractor;

/**
 * [역할] .xlsx 시트의 셀 텍스트 추출(간단 버전)
 * [이유] 표 데이터를 임베딩할 수 있게 직렬화
 * [주의] 대용량일 경우 행/열 제한, 특정 시트만 추출 등의 최적화 필요
 */
@Component
public class XlsxTextExtractor implements TextExtractor{
	@Override
	public String extract(Path file) throws Exception {
		try (var is = Files.newInputStream(file);
			var wb = new XSSFWorkbook(is)){
			StringBuilder sb = new StringBuilder();
			wb.forEach(sheet -> {
				sb.append("[SHEET] ").append(sheet.getSheetName()).append("\n");
				sheet.forEach(row -> {
					row.forEach(cell -> sb.append(cell.toString()).append("\n"));
					sb.append("\n");
				});
				sb.append("\n");
			});
			return sb.toString();
		}
	}
	@Override
	public String getExtension() {
		return "xlsx";
	}

}
