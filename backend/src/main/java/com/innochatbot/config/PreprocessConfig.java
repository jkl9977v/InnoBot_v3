package com.innochatbot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

//@Component
@Configuration
//@ConfigurationProperties(prefix="preprocess")
public class PreprocessConfig {
	
	@Value("${preprocess.enable:true}")
	private boolean enable;
	
	@Value("${preprocess.dedupe:true}")
	private boolean dedupe;
	
	@Value("${prrporcess.extractive-summary:false}")
	private boolean extractiveSummary;
	
	public boolean isEnable() { return enable; }
	public boolean isDedupe() { return dedupe; }
	public boolean isExtractiveSummanry() { return extractiveSummary; }
	
}
