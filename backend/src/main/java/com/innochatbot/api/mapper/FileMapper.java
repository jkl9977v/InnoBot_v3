package com.innochatbot.api.mapper;

import org.apache.ibatis.annotations.Mapper;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;

import com.innochatbot.admin.dto.FileDTO;

@Mapper
public interface FileMapper {

	public String filehashSelect(String fileId);

	public String fileIdSelect(@RequestParam("fileName") String fileName, @RequestParam("path") String path);

	public void fileHashUpdate(@RequestParam("newHash") String newHash, @RequestParam("fileId") String fileId);

	public void fileInsert(FileDTO dto);
	
	public FileDTO fileDetail(@Param("fileId") String fileId);
}
