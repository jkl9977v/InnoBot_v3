package com.innochatbot.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.innochatbot.admin.dto.AccessRuleDTO;
import com.innochatbot.admin.dto.StartEndPageDTO;

@Mapper
public interface AccessRuleMapper {

    public List<AccessRuleDTO> accessRuleList(StartEndPageDTO dto);

    public AccessRuleDTO accessRuleDetail(String accessId);

    public int accessRuleInsert(AccessRuleDTO dto);

    public void accessRuleUpdate(AccessRuleDTO dto);

    public void accessRuleDelete(String accessId);

	public Integer accessRuleCount();
}
