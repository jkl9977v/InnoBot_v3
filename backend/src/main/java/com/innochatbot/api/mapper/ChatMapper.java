package com.innochatbot.api.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface ChatMapper {

	//1. chunk만 유사도 검색
	public List<Map<String, Object>> chunkEmbeddingOnlySelect(@Param("chunkLimit") int chunkLimit);
	
	//2. file과 chunk 동시에 유사도 검색
	public List<Map<String, Object>> fileAndChunkEmbeddingSelect();
	
	//3. file -> chunk 순서로 유사도 검색
	public List<Map<String, Object>> fileNameEmbeddingSelect1();

	public List<Map<String, Object>> chunkEmbeddingSelect2(@Param("fileIds") List<String> fileIds);
	//List<String> fileIds

}
