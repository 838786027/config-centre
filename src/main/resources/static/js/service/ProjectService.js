function ProjectService() {
	this.list = function(successCallback) {
		$.ajax({
			url : $basePath + "project/list",
			success : successCallback
		});
	}
}