package com.innochatbot.api.service;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.innochatbot.api.dto.ChatResponse;
import com.innochatbot.api.dto.TopChunk;

import com.innochatbot.api.utill.VectorUtils;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

//OpenAI API 호출
@Service
public class ChatService {

    private final EmbeddingService embeddingService;
    @Autowired
    TopSearchService topSearchService;
    

    @Value("${openai.api.key}")
    private String apiKey;

    //@Value("${chat.useDummy:false}")
    //private boolean useDummy;
    private OpenAiService client;

    public ChatService(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    // @PostConstruct 로 초기화해도 좋습니다.
    private OpenAiService getClient() {
        if (client == null) {
            client = new OpenAiService(apiKey);
        }
        return client; 
    }

    public ChatResponse handle(String question) {
        /*     API 연결 테스트용
        if (useDummy) {
            // 테스트용 더미 응답
            List<Long> dummyIds = List.of(1L, 2L, 3L);
            String dummyAnswer = "이것은 테스트용 더미 응답입니다.";
            return new ChatResponse(dummyAnswer, dummyIds);
        }
         */

        // 1) 질문 임베딩
        float[] queryVec = embeddingService.embed(question);
        //queryVec = VectorUtils.l2NormalizeInPlace(queryVec);
        
        // 2) 유사도 Top-K 검색 (K=10)
        
        //유사도 점수 최소값 설정
        double minScore = 0.5;
        
        //유사도 검색 로직 3개
        //1. chunk만 유사도 검색
        int chunkLimit = 200;  //DB에서 가져올 후보 청크 수(예: 1000)
        int topK = 10;  //최종 상위 결과 수(예: 5)
        //List<TopChunk> rows = topSearchService.topChunkEmbedding(queryVec, chunkLimit, topK);
        
        //2. file과 chunk 동시에 유사도 검색
        double wTitle = 0.3;  //제목 가중치 (예: 0.3)
        double wChunk = 0.7;  //내용 가중치 (예: 0.7)
        //int topK = 10; //Top-K 개수
        //List<TopChunk> rows = topSearchService.topFileChunkEmbedding(queryVec, wTitle, wChunk, topK);
        
        //3. file -> chunk 순서로 유사도 검색
        int topM = 100;  //제목 1차 후보 개수 (예: 20~50)
        // int K;  	  //최종 청크 Top-K (예: 5)
        List<TopChunk> rows = topSearchService.topFileChunk(queryVec, topM, topK);
        
        // 공통 출력(검색 결과 확인)
        printResults(rows);
        

        
        /*
        //빈 결과 방어 
        if (rows == null || rows.isEmpty()) {
            // fallback 처리: K를 줄이거나, 다른 전략/키워드 검색으로 재시도
        }
        */
        StringBuilder prompt = new StringBuilder();
        int index = 1;
        for (TopChunk row : rows) {
            prompt.append("Document ").append(index).append(":\n");
            prompt.append(row.content()).append("\n\n"); // record 게터
            index++;
        }
        
        prompt.append("Question: ").append(question);

        // 4) GPT 호출 방식 (ChatMessage, completionRequest)
        //3.5 터보 모델 사용시
        ChatMessage system = new ChatMessage("system",
                "다음은 사내 기술 매뉴얼 및 문서의 발췌 내용입니다. "
                + "사용자가 한 질문에 대해, 이 문서만을 바탕으로 답변하세요. "
                + "문서에 없는 정보는 모른다고 하세요. 추측하지 마세요."
                + "당신은 이노티움 회사의 티움봇입니다.");
        ChatMessage user = new ChatMessage("user", prompt.toString());

        ChatCompletionRequest req = ChatCompletionRequest.builder()
        //타 모델 사용시 윗줄 주석처리하고 이거 사용
        //CompletionRequest req = CompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(system, user))
                //타 모델 사용시 .message 대신 이거 사용
                //.prompt(prompt.toString())
                .maxTokens(1000)
                .build();

        String answer = getClient()
                .createChatCompletion(req)
                .getChoices().get(0).getMessage().getContent()
                .trim();

        // 5) source chunk IDs 수집
        List<Long> ids = rows.stream()
        		.map(r -> Long.valueOf(r.chunkId()))
        		.toList();
        //타입 체크
        System.out.println(rows.get(0).getClass());
        return new ChatResponse(answer, ids);
    }
    
    private void printResults(List<TopChunk> rows) {
    	System.out.println("=== 검색 결과 ===");
        int idx = 1;
        for (TopChunk chunk : rows) {
            System.out.printf("[%02d] fileId=%s | chunkId=%s | score=%.4f\n",
                idx,
                chunk.fileId(),
                chunk.chunkId(),
                chunk.score()
            );
            System.out.println("Content: " + chunk.content());
            System.out.println("-------------------------------------------------");
            idx++;
        }
    }
    
    
    // float[] → byte[] 변환 (PostgreSQL pgvector용, LE 방식)
    private byte[] toBytes(float[] vec) {
        ByteBuffer buf = ByteBuffer.allocate(vec.length * 4);
        buf.order(ByteOrder.LITTLE_ENDIAN);
        for (float v : vec) {
            buf.putFloat(v);
        }
        return buf.array();
    }
}
