package com.innochatbot.api.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.innochatbot.api.dto.ChunkDTO;

@Mapper
public interface ChunkMapper {

	public void chunkInsert(ChunkDTO dto);
 
	public void chunkDelete(String fileId);

}
