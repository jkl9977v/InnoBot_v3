package com.innochatbot.admin.dto;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Alias("fileDTO")
@NoArgsConstructor
@AllArgsConstructor
public class FileDTO {

    String fileId;
    String fileName;
    String extension; //확장자
    String pathId;
    String hash; //파일의 해시값
    Long size;
    Date updateTime;
    byte[] embedding;
    
    String path;
}
