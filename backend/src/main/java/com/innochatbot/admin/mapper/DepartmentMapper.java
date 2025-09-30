package com.innochatbot.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;

@Mapper
public interface DepartmentMapper { 

	public int departmentInsert(DepartmentDTO dto);

	public Integer departmentCount();

	public List<DepartmentDTO> departmentList(StartEndPageDTO dto);

	public DepartmentDTO departmentDetail(String departmentId);

	public void departmentUpdate(DepartmentDTO dto);

	public void departmentDelete(String departmentId);

}
