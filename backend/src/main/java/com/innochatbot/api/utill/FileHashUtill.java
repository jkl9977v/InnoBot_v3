package com.innochatbot.api.utill;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.Base64;

public class FileHashUtill {
	
	public static String getMD5(Path filePath) throws Exception{
		byte[] bytes = Files.readAllBytes(filePath);
		MessageDigest md = MessageDigest.getInstance("MD5");
		return Base64.getEncoder().encodeToString(md.digest(bytes));
	}
	
	public static String getSHA256(Path filePath) throws Exception{
		byte[] bytes = Files.readAllBytes(filePath);
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		return Base64.getEncoder().encodeToString(md.digest(bytes));
	}
	

}
