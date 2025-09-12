package com.innochatbot.admin.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccessRuleCommand {
	String accessId;
	String accessName;
	String allowdId;
	String allowgId;
    String accessType;
}
