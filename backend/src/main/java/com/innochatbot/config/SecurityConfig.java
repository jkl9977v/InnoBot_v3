package com.innochatbot.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	
	
	// 수정 전 코드
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    http
	        .cors().and()
	        .csrf().disable()
	        .authorizeHttpRequests()
	            .requestMatchers("/login", "/css/**", "/js/**", "/img/**", "/admin/getHeader").permitAll()
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
	
	
	/*
    @Bean
    // 수정 이후 현재 사용중인 코드
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // ① CORS – credentials(세션쿠키) 허용 
            .cors(c -> c
                .configurationSource(req -> {
                    var cfg = new org.springframework.web.cors.CorsConfiguration();
                    cfg.setAllowedOrigins(List.of("http://localhost:3000", "http://192.168.11.146:3000")); // 프런트 포트
                    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
                    cfg.setAllowCredentials(true);          // ★ credentials 허용
                    cfg.addAllowedHeader("*");
                    return cfg;
                })
            )

            .csrf(csrf -> csrf.disable())

            // ② URL 접근 권한 
            .authorizeHttpRequests()
                .requestMatchers("/login", "/css/**", "/js/**", "/img/**", "/admin/getHeader").permitAll()
                .anyRequest().authenticated()               // 필요 시 authenticated()

            // ③ 로그아웃 설정 
            .and().logout(logout -> logout
                .logoutUrl("/logout")                       // 프런트 fetch 대상
                .invalidateHttpSession(true)                // 서버세션 무효
                .deleteCookies("JSESSIONID")                // ★ 브라우저 쿠키 제거
                .logoutSuccessHandler((req, res, auth) -> { // 200 JSON 응답
                    res.setStatus(200);
                    res.setContentType("application/json;charset=UTF-8");
                    res.getWriter().write("""
                        { "success": true, "message": "로그아웃 되었습니다." }
                    """);
                })
            );
                    return http.build();
    }
    */
        
        /*
        //         3) URL 권한 
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/login", "/css/**", "/js/**", "/img/**").permitAll()
            .anyRequest().authenticated()     // 필요에 따라 permitAll() 유지 가능
        )

        // 4) 로그아웃 
        .logout(logout -> logout
            .logoutUrl("/logout")
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID")
            .logoutSuccessHandler((req, res, auth) -> {
                res.setStatus(200);
                res.setContentType("application/json;charset=UTF-8");
                res.getWriter().write("{\"success\":true,\"message\":\"로그아웃 되었습니다.\"}");
            })
        ); 
         */


}
