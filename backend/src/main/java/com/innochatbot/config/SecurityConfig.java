package com.innochatbot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors() // ✅ CORS 설정 활성화
                .and()
                .csrf().disable() // (개발 중에는 보통 비활성화 disable())
                .authorizeHttpRequests()
            		.requestMatchers("/admin/login", "/css/**", "/js/**", "/img/**").permitAll()
            		//.requestMatchers("/admin/**").authenticated()  // 관리자 페이지 보호
            		.anyRequest().permitAll();
        //.authorizeHttpRequests().anyRequest().permitAll(); // 예시: 모든 요청 허용

        return http.build();
    }
}
/*
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
        	.cors().and()
        	.csrf().disable()
            .authorizeHttpRequests()
            	.requestMatchers("/admin/login", "/css/**", "/js/**", "/img/**").permitAll()
                .requestMatchers("/admin/**").authenticated()  // 관리자 페이지 보호
                .anyRequest().permitAll()
            .and()
            .formLogin()  // 기본 로그인 페이지 사용
                .loginPage("/admin/login")        // 커스텀 로그인 화면 사용 시 설정
                .defaultSuccessUrl("/admin/manuals/view", true)
                .permitAll()
            .and()
            .logout()
                .logoutSuccessUrl("/")
                .permitAll();

        return http.build();
    }
 */
