package com.innochatbot.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.innochatbot.admin.dto.FilePathDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;

@Mapper
public interface FilePathMapper {

    public List<FilePathDTO> filePathList(StartEndPageDTO dto);
    
    public Integer filePathCount(String pathId);

    public FilePathDTO filePathDetail(String pathId);

    public void filePathInsert(FilePathDTO dto);

    public void filePathUpdate(FilePathDTO dto);

    public void filePathDelete(String pathId);

	public String selectPathId(String fullFilePath);

	public String pathIdSelect(@Param("path") String path);

	public FilePathDTO filePathDetail2(String pathId);

	public List<FilePathDTO> filePathListAll(String searchWord);

	
}
