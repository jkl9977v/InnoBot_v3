package com.innochatbot.admin.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class CustomErrorController implements ErrorController {
	
	/*
	@RequestMapping("/error")
	public String handleError(HttpServletRequest request, Model model) {
		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		
		if(status != null) {
			int statusCode = Integer.parseInt(status.toString());
			
			if(statusCode == HttpServletResponse.SC_NOT_FOUND) {
				return "thymeleaf/error/404"; //404에러
			}
			
			if(statusCode == HttpServletResponse.SC_INTERNAL_SERVER_ERROR) {
				return "thymeleaf/error/500";
			}
			
		}
		return "thymeleaf/error/default"; //기타 에러
	}
	*/
	
	
	/*    
	 * @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        Integer status = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            switch (status) {
                case 400: return "error/400"; //파라미터 누락, 타입 불일치
                case 401: return "error/401"; //로그인 안된 상태에서 보호된 페이지 접근
                case 403: return "error/403"; //로그인은 했지만 권한 없는 사용자
                case 404: return "error/404"; //오타, URL 잘못됨, 컨트롤러 누락
                case 500: return "error/500"; //코드에서 예외 발생 (널 포인트  등등)
            }
        }
        return "error/default";
    } */

}
