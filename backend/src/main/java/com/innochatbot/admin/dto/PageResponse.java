package com.innochatbot.admin.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> { //JSON 용 페이징 DTO
	
	//페이징 
	int Page;			// 현재 페이지
	int limitRow;		// 한 페이지 당 행 수
	int startPageNum;	// 1, 11 … (블록 시작)
	int endPageNum;		// 10, 20 … (블록 끝)
	int maxPageNum;		// 마지막 페이지
	int count;			// 전체 레코드 수
	
	//검색 및 필터
	String searchWord;
	String kind;
	String kind2;
	
	//실제 데이터
	List<T> list;
}
