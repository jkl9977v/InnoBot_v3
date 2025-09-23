package com.innochatbot.admin.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("PageBlockDTO")
public class PageBlockDTO {
	Integer startPageNum;
	Integer endPageNum;
	Integer maxPageNum; //전체 마지막 페이지

}
