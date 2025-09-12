//getHtml.js

function loadGetHeader(targetId, url){
	$.get(url, function (html) {
	  const $container = $("#" + targetId);
	  $container.html(html);

	  // 삽입된 <script> 태그 수동 실행
	  $container.find("script").each(function () {
	    const $oldScript = $(this);
	    const newScript = document.createElement("script");

	    if ($oldScript.attr("src")) {
	      newScript.src = $oldScript.attr("src");
	    } else {
	      newScript.textContent = $oldScript.text();
	    }

	    document.body.appendChild(newScript);
	    $oldScript.remove();
	  });
	}).fail(function () {
	  console.error("loadGetHeader error: AJAX 요청 실패");
	});
}

function loadGetMain2(targetId, url){
	$.get(url, function (html) {
	  const $container = $("#" + targetId);
	  $container.html(html);

	  // 삽입된 <script> 태그 수동 실행
	  $container.find("script").each(function () {
	    const $oldScript = $(this);
	    const newScript = document.createElement("script");

	    if ($oldScript.attr("src")) {
	      newScript.src = $oldScript.attr("src");
	    } else {
	      newScript.textContent = $oldScript.text();
	    }

	    document.body.appendChild(newScript);
	    $oldScript.remove();
	  });
	}).fail(function () {
	  console.error("loadGetMain2 error: AJAX 요청 실패");
	});
}