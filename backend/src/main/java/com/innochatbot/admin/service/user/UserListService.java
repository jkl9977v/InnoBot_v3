package com.innochatbot.admin.service.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.innochatbot.admin.dto.DepartmentDTO;
import com.innochatbot.admin.dto.GradeDTO;
import com.innochatbot.admin.dto.PageBlockDTO;
import com.innochatbot.admin.dto.PageResponse;
import com.innochatbot.admin.dto.StartEndPageDTO;
import com.innochatbot.admin.dto.UserDTO;
import com.innochatbot.admin.dto.UserListResponse;
import com.innochatbot.admin.mapper.DepartmentMapper;
import com.innochatbot.admin.mapper.GradeMapper;
import com.innochatbot.admin.mapper.UserMapper;
import com.innochatbot.admin.service.ListPageService;

@Service
public class UserListService {
	@Autowired
	UserMapper userMapper;
	@Autowired
	ListPageService listPageService;
	@Autowired
	DepartmentMapper departmentMapper;
	@Autowired
	GradeMapper gradeMapper;

	public void userList(int page, int limitRow, String searchWord, String kind, Model model, String kind2) {
		//1.
		StartEndPageDTO dto = listPageService.StartEndRow(page, limitRow, null, searchWord, kind, kind2);
		
		//2.
		Integer count = userMapper.userCount();
		
		//3.
		List<UserDTO> list = userMapper.userList(dto);
		
		//4. 
		listPageService.ShowList(page, limitRow, count, searchWord, list, model, null, kind);
		
		List<DepartmentDTO> department = departmentMapper.departmentList(null);
		model.addAttribute("department", department);
		
		List<GradeDTO> grade = gradeMapper.gradeList(null,null);
		model.addAttribute("grade", grade);
		model.addAttribute("kind2", kind2);
		
	}

	public UserListResponse userList2(int page, int limitRow, String searchWord, String kind, String kind2) {
		StartEndPageDTO startEndPageDTO = listPageService.StartEndRow(page, limitRow, null, searchWord, kind, kind2);
		
		Integer count = userMapper.userCount();
		
		List<UserDTO> list = userMapper.userList(startEndPageDTO);
		
		//페이지 블록 계산
		PageBlockDTO pageDTO = listPageService.PageBlock(page, limitRow, count);
		
		//PageResponse 로직
		PageResponse<UserDTO> user = new PageResponse<>();
		user.setPage(page);
		user.setLimitRow(limitRow);
		user.setStartPageNum(pageDTO.getStartPageNum());
		user.setEndPageNum(pageDTO.getEndPageNum());
		user.setMaxPageNum(pageDTO.getMaxPageNum());
		user.setCount(count);
		user.setSearchWord(searchWord);
		user.setKind(kind);
		user.setKind2(kind2);
		user.setList(list);
		
		//옵션 목록
		List<DepartmentDTO> department = departmentMapper.departmentList(null);
		List<GradeDTO> grade = gradeMapper.gradeList(null, null);
		
		//wrapper에 담아 반환
		UserListResponse res = new UserListResponse();
		res.setUsers(user);
		res.setDepartments(department);
		res.setGrades(grade);
		
		return res;
	}

}
