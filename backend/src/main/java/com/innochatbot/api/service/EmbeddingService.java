package com.innochatbot.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.theokanning.openai.embedding.EmbeddingRequest;
import com.theokanning.openai.service.OpenAiService;

import jakarta.annotation.PostConstruct;

@Service
public class EmbeddingService { //질문을 벡터화 하는 파일이다.

    @Value("${openai.api.key}") //OpenAI key 환경변수 주입
    private String apiKey;

    //@Value("${embedding.useDummy:true}") //더미벡터 사용 여부(기본값 true)
    //private boolean useDummy;
    private OpenAiService client; //클라이언트 선언

    //서비스가 초기화 될 때 api 클라이언트 생성
    @PostConstruct
    private void init() {
        // OpenAiService 클라이언트 초기화
        System.out.println("현재apiKey" + apiKey);
        this.client = new OpenAiService(apiKey);
    }

    // 질문 또는 청크 텍스트를 임베딩합니다.
    // 개발/테스트 단계에서는 더미 벡터를 반환하도록 설정할 수 있습니다.
    public float[] embed(String text) {
        //System.out.println("EmbeddingService.useDummy=" + useDummy);
        // if (useDummy) {
        //     return embedDummy(text); //더미벡터 리턴
        // } else {
        return embedProduction(text); //실제 API 호출
        //}
    }

    //실제 OpenAI API를 사용(호출)해 임베딩 벡터를 반환합니다. (단일청크 기준)
    private float[] embedProduction(String text) {  //질문을 임베딩시, 파일을 임베딩 시 둘 다 사용
        // 임베딩 요청 구성
        EmbeddingRequest request = EmbeddingRequest.builder()
                .model("text-embedding-3-small") //사용 모델
                .input(List.of(text)) //단일 텍스트 입력
                .build();

        // API 호출 및 결과 변환
        List<Double> data = client.createEmbeddings(request)
                .getData().get(0).getEmbedding();
        // List<Double>를 float[]로 변환 (강제형 변환)
        float[] vec = new float[data.size()];
        for (int i = 0; i < data.size(); i++) {
            vec[i] = data.get(i).floatValue();
        }
        return vec;
    }

    /*  ///개발/테스트용 더미 벡터를 반환합니다. 테스트시에만 사용, 실제 서비스시에는 사용하지 않는다.
    private float[] embedDummy(String text) {
        // 모델 차원(예: 1536)에 맞춰 0으로 초기화된 벡터 반환
        return new float[1536];
    }
     */
}
