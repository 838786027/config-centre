function ZKTreeService() {
	this.ls = function(path, successCallback) {
		$.ajax({
			url : $basePath + "zk/tree/ls",
			data : {
				"path" : path
			},
			success : successCallback
		});
	}

	this.cat = function(path, successCallback) {
		$.ajax({
			url : $basePath + "zk/tree/cat",
			data : {
				"path" : path
			},
			success : successCallback
		});
	}

	this.download = function(path) {
		// 模拟表单下载
		var form = $("<form>");// 定义一个form表单
		form.attr("style", "display:none");
		form.attr("target", "");
		form.attr("method", "post");
		form.attr("action", $basePath + 'zk/tree/download');
		var fileInput = $("<input>");
		fileInput.attr("type", "hidden");
		fileInput.attr("id", "path");// 设置属性的名字
		fileInput.attr("name", "path");// 设置属性的名字
		fileInput.attr("value", path);// 设置属性的值
		$("body").append(form);// 将表单放置在web中
		form.append(fileInput);
		form.submit();// 表单提交
		// form.remove();
	}
	
	this.updateZnode = function(path,context,successCallback){
		$.ajax({
			url : $basePath + "zk/tree/update_znode",
			type:"post",
			data : {
				"path" : path
				,"context":context
			},
			success : successCallback
		});
	}
}