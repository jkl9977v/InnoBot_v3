package com.innochatbot.admin.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Alias("accessRuleDTO")
@NoArgsConstructor
@AllArgsConstructor
public class AccessRuleDTO {
	String accessId;
	String accessName;
	String allowdId;
	String allowgId;
    String accessType;
    
    DepartmentDTO DepartmentDTO;
    GradeDTO GradeDTO;
}
