package com.innochatbot.admin.command;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DepartmentCommand {
	String allowdId;
	String allowdName;
	String departmentId;
	String departmentName;
	
	List<String> departmentIds;
}
