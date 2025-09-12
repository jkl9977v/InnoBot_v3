package com.innochatbot.api.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("chunkDTO")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChunkDTO {
	Long chunkId;
	String fileId;
	Integer sequence;
	String content;
	byte[] embedding;
}
