//checkBox.js

$(function(){
	$("#checkBoxs").click(function(){
		if($("#checkBoxs").prop("checked")){
			$(":checkbox[name=boxs]").prop("checked", true);
		}else{
			$("input:checkbox[name='boxs']").prop("checked", false);
		}
		//prodChk();
	});
	$("input:checkbox[name='boxs']").click(function(){
		var tot = $("input:checkbox[name='boxs']").length;
		var cnt = $("input:checkbox[name='boxs']:checked").length;
		if(tot==cnt) $("#checkBoxs").prop("checked", true);
		else $("#checkBoxs").prop("checked", false);
		//prodChk();
	});
});