package com.innochatbot.api.dto;

//요청DTO
public record ChatRequest(String question) {
    //레코드 기반이므로 생성자, getter, json변환이 자동으로 지원됨

}

/*/
package com.innochatbot.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ChatRequest {
    @JsonProperty("question")
    private String question;

    public ChatRequest() { //Jackson용 기본 생성자 
     }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
 */
