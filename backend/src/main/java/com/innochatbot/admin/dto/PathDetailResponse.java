package com.innochatbot.admin.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("PathDetailResponse")
public class PathDetailResponse {
	
	FilePathDTO filePath;
	AccessRuleDTO accessRule;

}
