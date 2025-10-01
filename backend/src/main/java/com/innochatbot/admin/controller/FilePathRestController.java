package com.innochatbot.admin.controller;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.innochatbot.admin.command.FilePathCommand;
import com.innochatbot.admin.dto.FileListResponse;
import com.innochatbot.admin.dto.PathDetailResponse;
import com.innochatbot.admin.mapper.FilePathMapper;
import com.innochatbot.admin.service.AutoNumService;
import com.innochatbot.admin.service.file.FileDetailService;
import com.innochatbot.admin.service.filePath.FilePathDetailService;
import com.innochatbot.admin.service.filePath.FilePathListService;
import com.innochatbot.admin.service.filePath.FilePathUpdateService;
import com.innochatbot.admin.service.filePath.FilePathWriteService;

@RestController
@RequestMapping("admin/file")
public class FilePathRestController { //파일 경로 관리

    @Autowired
    AutoNumService autoNumService;

    @Autowired
    FilePathWriteService filePathWriteService;
    @Autowired
    FilePathListService filePathListService;
    @Autowired
    FilePathUpdateService filePathUpdateService;

    @Autowired
    FilePathDetailService filePathDetailService;
    @Autowired
    FileDetailService fileDetailService;
    
    /*
    @GetMapping("pathWrite") //경로 추가
    public String filePathWrite(
            FilePathCommand filePathCommand,
            @RequestParam(defaultValue = "path_") String sep,
            @RequestParam(defaultValue = "path_id") String column,
            @RequestParam(defaultValue = "6") int len,
            @RequestParam(defaultValue = "file_path") String table, Model model) {

        filePathCommand.setPathId( autoNumService.autoNum1(sep, column, len, table) ); 
        model.addAttribute("command", filePathCommand);
        
        return "thymeleaf/path/pathWrite";
    }
    */

    @PostMapping("pathWrite")
    public String filePathWrite1(FilePathCommand filePathCommand) {
        filePathWriteService.pathWrite(filePathCommand);
        return "redirect:/admin/file";
    }
    
    //fileList
    @GetMapping("fileList") //경로쪽 코드 복잡할 예정, 경로 목록 보여주기
    public FileListResponse fileList(@RequestParam (defaultValue = "1") int page
    		, @RequestParam (defaultValue = "10") int limitRow
    		, @RequestParam (defaultValue = "path_000000001")String pathId
    		, @RequestParam (required = false) String searchWord
    		, @RequestParam (required = false) String kind
    		) {
    	//파일시스템을 보여줌
    	return filePathListService.filePathList2(page, limitRow, pathId, searchWord, kind);
    }
    
    
    @GetMapping("pathList") // (미개발 기능) 기준경로부터 폴더를 보여주는 기능
    public String filePathList(@RequestParam (defaultValue="1") int page
    		, @RequestParam (defaultValue = "10") int limitRow
    		, @RequestParam (defaultValue = "path_000000001")String pathId
    		, @RequestParam (required = false) String searchWord
    		, @RequestParam (required = false ) String kind
    		, Model model) {
    	//파일시스템을 보여줌
    	filePathListService.filePathList(page, limitRow, pathId, searchWord, model, kind);
    	return "thymeleaf/file";
    }
    @GetMapping("pathSearch")
    public String filePathSearch(String searchWord, Model model) {
    	filePathListService.filePathSearch(searchWord, model);
    	return "thymeleaf/path/filePathSearch";
    }
    
    @GetMapping("pathDetail")
    public String filePathDetail(@RequestParam String pathId, Model model) {
    	filePathDetailService.pathDetail(pathId, model);
    	return "thymeleaf/path/pathDetail";
    }

    @GetMapping("pathUpdate")
    public String filePathUpdate(@RequestParam String pathId, Model model) {
        filePathDetailService.pathDetail(pathId, model);
        return "thymeleaf/path/pathUpdate";
    }

    @PostMapping("pathUpdate")
    public String filePathUpdate1(FilePathCommand filePathCommand) {
        filePathUpdateService.pathUpdate(filePathCommand);
        return "redirect:pathList";
    }
    
    
    @GetMapping("addAccessRule") //기능 추가 필요함 (아직 미완성)
    public PathDetailResponse addAccessRule(@RequestParam String pathId) {
        return filePathDetailService.pathDetail2(pathId);
    }

    @PostMapping("addAccessRule")
    public ResponseEntity<?> addAccessRule1(@RequestBody FilePathCommand filePathCommand) {
    	System.out.println(filePathCommand);
    	Boolean updateResult = filePathUpdateService.pathUpdate(filePathCommand);
    	
    	if(updateResult) {
    		// 200 ok + { success : true } JSON 객체 전달
    		return ResponseEntity.ok(Collections.singletonMap("success", true)); //성공 JSON, redirect : 200 ok
    	} else {
    		// 500 (또는 400) -> 프론트가 예외처리 가능
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    				.body(Collections.singletonMap("insert_error", false)); //실패 JSON
    	}
    }
    
    
    @Autowired
    FilePathMapper filePathMapper;
    
    /*
    @GetMapping("pathDelete")
    public String filePathDelete(@RequestParam String pathId) {
    	filePathMapper.filePathDelete(pathId);
    	System.out.println("삭제: " + pathId);
        return "redirect:/admin/file";
    }
    */
    
    @GetMapping("fileDetail")
    public String fileDetail(@RequestParam("fileId") String fileId, Model model) {
    	fileDetailService.fileDetail(fileId, model);
    	return "thymeleaf/file/fileDetail";
    }
}
