package com.innochatbot.admin.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Alias("fileListResponse")
@AllArgsConstructor
@NoArgsConstructor
public class FileListResponse {
	PageResponse<FilePathDTO> fileList; //현재 경로의 파일, 폴더 목록
	FilePathDTO pathDetial ; // 현재경로 상세정보 표시
}
