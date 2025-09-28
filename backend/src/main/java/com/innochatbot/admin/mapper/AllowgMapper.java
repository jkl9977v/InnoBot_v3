package com.innochatbot.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;

@Mapper
public interface AllowgMapper {
	public int allowgInsert(GradeDTO dto);

	public Integer allowgCount();

	public List<GradeDTO> allowgList(StartEndPageDTO dto);

	public GradeDTO allowgDetail(String allowgId);

	public void allowgUpdate(GradeDTO dto);

	public void allowgDelete(String allowgId);
}
