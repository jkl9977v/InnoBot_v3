//getHtml.js

$(function(){
	$.ajax({
		type : "get",
		url : "/admin/getHeader",
		dataType : "html",
		success : function(result){
			$("#getHeader").html(result);
		},
		error : function(){
			alert("서버 오류");
		}
	});
	$.ajax({
		type : "get",
		url : "/admin/getMain2",
		dataType : "html",
		success : function(result){
			$("#getMain2").html(result);
		},
		error : function(){
			alert("서버 오류");
		}
	});
})