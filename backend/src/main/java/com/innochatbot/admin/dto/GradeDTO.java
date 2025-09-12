package com.innochatbot.admin.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("gradeDTO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GradeDTO { //등급(직급)정보, 허용등급(직급) 규칙에 사용함
	String allowgId;
	String allowgName;
	String gradeId;
	String gradeName;
	
	Integer gradeLevel;
}
