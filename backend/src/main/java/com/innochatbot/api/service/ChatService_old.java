package com.innochatbot.api.service;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.innochatbot.api.dto.ChatResponse;
import com.innochatbot.api.mapper.ChatMapper;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

//OpenAI API 호출
@Service
public class ChatService_old {

    private final JdbcTemplate jdbc;
    private final EmbeddingService embeddingService;
    @Autowired
    ChatMapper chatMapper;

    @Value("${openai.api.key}")
    private String apiKey;

    //@Value("${chat.useDummy:false}")
    //private boolean useDummy;
    private OpenAiService client;

    public ChatService_old(JdbcTemplate jdbc, EmbeddingService embeddingService) {
        this.jdbc = jdbc;
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
        float[] qVec = embeddingService.embed(question);
 
        // 2) 유사도 Top-K 검색 (K=5)
        String sql = """
          SELECT chunk_id, content
          FROM chunk
          ORDER BY (embedding <=> ?)
          LIMIT 50
        """;
        /*
        SELECT f.file_id, chunk_id, content
        FROM chunk c
        join file f
        on c.file_id = f.file_id
        ORDER BY (c.embedding <=> ?)
        LIMIT 10
        */
        List<Map<String, Object>> rows = jdbc.queryForList(sql, toBytes(qVec));

        // 3) 프롬프트 생성
        StringBuilder prompt = new StringBuilder();
        int index = 1;
        for (Map<String, Object> row : rows) {
            //prompt.append(row.get("content")).append("\n---\n");
            prompt.append("Document " + index + ":\n");
            prompt.append(row.get("content")).append("\n\n");
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
                .map(r -> ((Number) r.get("chunk_id")).longValue())
                .toList();

        return new ChatResponse(answer, ids);
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
