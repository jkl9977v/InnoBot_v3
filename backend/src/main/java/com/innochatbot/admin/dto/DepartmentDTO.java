package com.innochatbot.admin.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("departmentDTO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentDTO { //부서정보, 허용부서 규칙에 사용함
	String allowdId;
	String allowdName;
	String departmentId;
	String departmentName;
}
