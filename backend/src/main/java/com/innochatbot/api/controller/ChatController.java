package com.innochatbot.api.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.api.dto.ChatRequest;
import com.innochatbot.api.dto.ChatResponse;
import com.innochatbot.api.service.ChatService;
//import java.util.*;

@CrossOrigin(origins = "http://localhost:5173") //프론트엔드 주소에 맞게 조정, React에서 요청할 수 있도록 cors허용
@RestController
@RequestMapping("/chat") //'/chat' url로 rest api 생성 
public class ChatController { //React에서 보내는 chat post 요청을 받아서 처리한다.
    //의존성

    private final ChatService chatService; //2-4-2

    //생성자 주입
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    //post /chat요청 처리/
    //요청 바디(JSON) -> chatrequest로 바인딩 -> 서비스로 전달 -> chatResponse로 반환
    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest req) {
        return chatService.handle(req.question());
    }
}
