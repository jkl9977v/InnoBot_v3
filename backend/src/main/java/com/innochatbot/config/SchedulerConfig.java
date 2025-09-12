package com.innochatbot.config;

import org.springframework.context.annotation.Configuration;

@Configuration
//@EnableScheduling
public class SchedulerConfig {
	/*
	//임베딩 전용 스레드풀을 직접 만들면 기본 설정에 의존하지 않으므로 안전
	@Bean("embeddingExecutor")
	public ThreadPoolTaskExecutor embeddingExecutor() {
		ThrreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
		ex.setCorePoolSize(1);  //동시 1개만 실행 (원하면 늘릴 수 있음)
		ex.setMaxPoolSize(1);
		ex.setQueueCapacity(0); //큐를 두지 않음(필요하면 증가)
		ex.setThreadNamePrefix("embedding");
		ex.initialize();
		return ex;
	}
	*/
}
