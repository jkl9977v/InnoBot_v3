package com.innochatbot.api.component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.innochatbot.admin.dto.ChatbotDTO;
import com.innochatbot.admin.service.chatBot.ChatbotDetailService;
import com.innochatbot.api.service.EmbeddingCliService;

import jakarta.annotation.PreDestroy;

@Component
public class ProgrammaticEmbeddingScheduler { //자바 표준 ScheduledExecutorService로만 스케줄 처리
	
	@Autowired
	ChatbotDetailService chatbotDetailService;
	
	//2. ScheduledExecutorService에 작업 등록
	private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor(r-> {
		Thread t = new Thread(r, "prog-embedding-scheduler");
		t.setDaemon(false);
		return t;
	});
	
	private final EmbeddingCliService embeddingCliService;
	private final AtomicBoolean running = new AtomicBoolean(false);
	
	public ProgrammaticEmbeddingScheduler(EmbeddingCliService embeddingCliService) {
		this.embeddingCliService = embeddingCliService;
	}
	
	//0. 스프링빈 초기화
	//1. 애플리케이션 준비 시 스케줄 등록(ApplicationReadyEvent 사용 권장)
	@EventListener(ApplicationReadyEvent.class)
	public void startScheduler() {
		/*
		 * if(min == null || hour == null) { //최초 기본값 min = 60; hour = 1; }
		 */
		ChatbotDTO dto = chatbotDetailService.returnDTO();
		int hour = dto.getHour();
		int min = dto.getMin(); //0 ~ 59분
		
		//initialDelay : 시작 지연(ms), period: 주기(ms)
		long initialDelay = 10000; //10초 후 시작(안정성)  
		long period = hour * 60 * 60 * 1000 + min * 60 * 1000; //5분마다 실행(원하는 값으로 변경)
		executor.scheduleWithFixedDelay(this::runOnceSafely, initialDelay, period, TimeUnit.MILLISECONDS);
	}
	
	//3. initialDelay후에 runOnceSafely 실행, 실제 작업 래퍼(중복방지)
	private void runOnceSafely() {
		if(!running.compareAndSet(false, true)) {
			System.out.println("이미 실행 중. 스킵.");
			return;
		}
		try { //동기식으로 실행
			embeddingCliService.EmbeddingCliService();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			running.set(false);
		}
	}
	
	//4. 애플리케이션 종료 시 스케줄러 정리
	@PreDestroy
	public void shutdown() {
		executor.shutdown();
		try {
			if (!executor.awaitTermination(10, TimeUnit.SECONDS)) {
				executor.shutdownNow();
			}
		} catch (InterruptedException e) {
			executor.shutdownNow();
			Thread.currentThread().interrupt();
		}
	}
}
