package com.innochatbot.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;

@Mapper
public interface GradeMapper { 

	public int gradeInsert(GradeDTO dto);

	public Integer gradeCount(Integer gradeLevel);

	public List<GradeDTO> gradeList(@Param("dto") StartEndPageDTO dto
			, @Param("gradeLevel") Integer gradeLevel);

	public GradeDTO gradeDetail(String gradeId);

	public void gradeUpdate(GradeDTO dto);

	public void gradeDelete(String gradeId);

}
