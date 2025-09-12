package com.innochatbot.admin.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("StartEndPageDTO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StartEndPageDTO {
	int startRow;
	int endRow;
	String searchWord;
	String kind;
	String idColumn;
	String kind2;
}
