package com.innochatbot.api.controller;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.Executor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.api.service.EmbeddingCliService;

@RestController
@RequestMapping("/admin/embedding")
public class EmbeddingController { //수동 임베딩 호출
	private final EmbeddingCliService embeddingCliService;
	private final Executor embeddingExecutor; // 스레드풀 (또는 @Async 사용)
	
    // 간단한 상태 저장용 Map (운영은 DB 사용 권장)
    private final ConcurrentMap<String, String> embeddingStatus = new ConcurrentHashMap<>();
	
	public EmbeddingController(EmbeddingCliService embeddingCliService
			, Executor embeddingExecutor) {
		this.embeddingCliService= embeddingCliService;
		this.embeddingExecutor = embeddingExecutor;
	}
	
//	@PostMapping("/run")
//	public ResponseEntity<String> runOnce() throws Exception {
//		//동기화 형 호출 : 호출한 클라이언트는 embeddingService 작업이 끝날 때까지 기다린다.
//		embeddingCliService.EmbeddingCliService();
//		return ResponseEntity.ok("임베딩 작업 시작");
//	}
	
	// 비동기 트리거: 즉시 202과 jobId 반환
    @PostMapping("/run")
    public ResponseEntity<Map<String, String>> runOnceAsync() {
        String jobId = UUID.randomUUID().toString();
        embeddingStatus.put(jobId, "READY"); // 초기 상태

        // 백그라운드에서 작업 실행
        embeddingExecutor.execute(() -> {
            try {
                embeddingCliService.EmbeddingCliService();
                embeddingStatus.put(jobId, "COMPLETE");
            } catch (Exception e) {
            	embeddingStatus.put(jobId, "FAILED: " + e.getMessage());
                // 예외 로그 남기기
                e.printStackTrace();
            }
        });

        Map<String, String> body = Map.of("jobId", jobId, "status", "RUNNING");
        // 202 Accepted: 요청을 받아들였고, 처리는 비동기적으로 수행 중임을 의미
        return ResponseEntity.accepted().body(body);
    }

    // 상태 조회 엔드포인트 (GET)
    @GetMapping("/status/{jobId}")
    public ResponseEntity<Map<String, String>> getStatus(@PathVariable String jobId) {
        String status = embeddingStatus.getOrDefault(jobId, "NOT_FOUND");
        return ResponseEntity.ok(Map.of("jobId", jobId, "status", status));
    }
}

/*
@RestController
@RequestMapping("/admin/embedding")
public class EmbeddingAsyncController {

    private final EmbeddingService embeddingService;
    private final Executor embeddingExecutor; // 스레드풀 (또는 @Async 사용)

    // 간단한 상태 저장용 Map (운영은 DB 사용 권장)
    private final ConcurrentMap<String, String> jobStatus = new ConcurrentHashMap<>();

    public EmbeddingAsyncController(EmbeddingService embeddingService,
                                    @Qualifier("embeddingExecutor") Executor embeddingExecutor) {
        this.embeddingService = embeddingService;
        this.embeddingExecutor = embeddingExecutor;
    }

    // 비동기 트리거: 즉시 202과 jobId 반환
    @PostMapping("/run")
    public ResponseEntity<Map<String, String>> runOnceAsync() {
        String jobId = UUID.randomUUID().toString();
        jobStatus.put(jobId, "RUNNING"); // 초기 상태

        // 백그라운드에서 작업 실행
        embeddingExecutor.execute(() -> {
            try {
                embeddingService.processAllDocs(Paths.get(System.getProperty("embedding.docs.dir", "D:/InnoBot_v3/docs")));
                jobStatus.put(jobId, "COMPLETED");
            } catch (Exception e) {
                jobStatus.put(jobId, "FAILED: " + e.getMessage());
                // 예외 로그 남기기
                e.printStackTrace();
            }
        });

        Map<String, String> body = Map.of("jobId", jobId, "status", "RUNNING");
        // 202 Accepted: 요청을 받아들였고, 처리는 비동기적으로 수행 중임을 의미
        return ResponseEntity.accepted().body(body);
    }

    // 상태 조회 엔드포인트 (GET)
    @GetMapping("/status/{jobId}")
    public ResponseEntity<Map<String, String>> getStatus(@PathVariable String jobId) {
        String status = jobStatus.getOrDefault(jobId, "NOT_FOUND");
        return ResponseEntity.ok(Map.of("jobId", jobId, "status", status));
    }
}
*/