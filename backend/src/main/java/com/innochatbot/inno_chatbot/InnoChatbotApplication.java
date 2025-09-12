package com.innochatbot.inno_chatbot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.innochatbot.admin.command.LoginCommand;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@SpringBootApplication(scanBasePackages = "com.innochatbot") 
@MapperScan("com.innochatbot.admin.mapper")
@MapperScan("com.innochatbot.api.mapper")
@Controller
//@PropertySource(value = "classpath:.env", ignoreResourceNotFound = true)
//@EnableScheduling
public class InnoChatbotApplication {

    public static void main(String[] args) {
        SpringApplication.run(InnoChatbotApplication.class, args);
    }
    
    
    @RequestMapping("/")
    @ResponseBody
    public ResponseEntity<Void> index() {
    	return ResponseEntity.ok().build(); 
    } 

}
 