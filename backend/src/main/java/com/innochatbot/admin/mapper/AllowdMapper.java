package com.innochatbot.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;

@Mapper
public interface AllowdMapper {
	public int allowdInsert(DepartmentDTO dto);

	public Integer allowdCount();

	public List<DepartmentDTO> allowdList(StartEndPageDTO dto);

	public List<DepartmentDTO> allowdDetail(String allowdId);

	public void allowdUpdate(DepartmentDTO dto);

	public int allowdDelete(String allowdId);

	public Integer allowdCount2(String allowdId);
}
