function Poller(url,periodMs,data,successCallback) {
	this.timerId;
	this.url = url;
	this.periodMs = periodMs;
	this.data = data;
	this.successCallback = successCallback;
	/**
	 * 开始轮询请求
	 */
    if(!('poll' in this.__proto__))
        this.__proto__['poll']=function (){
    		clearInterval(this.timerId);
    		this.timerId=setInterval(requestFunction(this.url,this.data,this.successCallback),this.periodMs);
    		function requestFunction(url,data,successCallback){
    		    return function(){
    		        $.ajax({
    		            url : url,
    		            type:"post",
    		            data : data,
    		            success : successCallback});
    		    }
    		}
        }
    
    /**
     * 开始轮询请求
     * http contentType：application/json; charset=utf-8
     */
    if(!('pollWithJson' in this.__proto__))
        this.__proto__['pollWithJson']=function (){
            clearInterval(this.timerId);
            this.timerId=setInterval(function(){
                    $.ajax({
                        url : url,
                        type:"post",
                        contentType: "application/json; charset=utf-8",
                        data : JSON.stringify(data),
                        success : successCallback});
            },periodMs);
        }
    
    if(!('stop' in this.__proto__))
        this.__proto__['stop']=function (){
    		clearInterval(this.timerId);
        }
}