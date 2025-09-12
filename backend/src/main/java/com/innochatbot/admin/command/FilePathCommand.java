package com.innochatbot.admin.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Setter
@Getter
public class FilePathCommand {

	 String pathId;
	 String path;
	 String accessId;
	 Integer depth;
	 String parentId;
	 
}
