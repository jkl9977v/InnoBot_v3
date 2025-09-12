package com.innochatbot.admin.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GradeCommand { //등급(직급)정보, 허용등급(직급) 규칙에 사용함
	String allowgId;
	String allowgName;
	String gradeId;
	String gradeName;
	
	Integer gradeLevel;
}
