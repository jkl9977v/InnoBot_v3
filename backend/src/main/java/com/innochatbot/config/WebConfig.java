package com.innochatbot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") //모든 IP 경로에 대해
                        .allowedOrigins("http://localhost:5173",
                                "http://192.168.11.146:5173", "http://172.22.144.1:5173",
                                "http://192.168.134.1:5173", "http://192.168.100.1:5173",
                                "http://localhost:3000",
                                "http://192.168.11.146:3000", "http://172.22.144.1:3000",
                                "http://192.168.134.1:3000", "http://192.168.100.1:3000") //React 주소
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }

        };
    }

}
