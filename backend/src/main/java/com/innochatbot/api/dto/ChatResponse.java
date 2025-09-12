package com.innochatbot.api.dto;

import java.util.List;

//응답DTO
public record ChatResponse(String answer, List<Long> sourceChunkIds) {


///레코드 기반이므로 생성자, getter, json변환이 자동으로 지원됨
}
