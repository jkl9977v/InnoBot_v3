package com.innochatbot.admin.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AutoNumMapper {

    public String autoNum1(@Param(value="sep") String sep
                , @Param(value="column") String column
                , @Param(value="len") int len
                , @Param(value="table") String table);

	public String autoNum2(@Param(value="sep") String sep
			, @Param(value="column") String column
			, @Param(value="len") int len
			, @Param(value="table") String table
			, @Param(value="zeroLen") int zeroLen);


    
}
