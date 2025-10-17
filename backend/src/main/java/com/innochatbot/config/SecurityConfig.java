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
	        .cors().and()
	        .csrf().disable()
	        .authorizeHttpRequests()
	            .requestMatchers("/login", "/css/**", "/js/**", "/img/**").permitAll()
	            .anyRequest().permitAll()
	        .and()
	        .logout(logout -> logout
	            .logoutUrl("/logout") // 기본값이기도 함
	            .invalidateHttpSession(true)
	            .deleteCookies("JSESSIONID")
	            .logoutSuccessHandler((req, res, auth) -> {
	                res.setStatus(200);
	                res.setContentType("application/json;charset=UTF-8");
	                res.getWriter().write("{\"success\":true,\"message\":\"로그아웃 되었습니다.\"}");
	            })
	        );
	    return http.build();
	}
}
