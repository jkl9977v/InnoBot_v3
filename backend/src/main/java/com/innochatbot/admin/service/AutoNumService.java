package com.innochatbot.admin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.innochatbot.admin.mapper.AutoNumMapper;


@Service
public class AutoNumService {
    //select concat($column, nvl(max(substring(coloumn, 어디부터)),000000,+1) from table;

    @Autowired
    AutoNumMapper autoNumMapper;
    
    public String autoNum1(String sep, String column, int len, String table){
        String autoNum=autoNumMapper.autoNum1(sep, column, len, table);
        return autoNum;
    }

	public String autoNum2(String sep, String column, int len, String table, int zeroLen) { 
		String autoNum = autoNumMapper.autoNum2(sep, column, len, table, zeroLen);
		return autoNum;
	}

}
