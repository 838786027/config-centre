/**
 * @author caixiaopeng
 * @create_datetime 2018/4/10 15:07
 */

/**
 * 依赖js/sockjs-0.3.min.js
 * @param url
 * @constructor
 */
function WebSocketBuilder(url) {
    this.url = url;

    /**
     *
     * @return websocket
     * websocket.onopen = function(event) {
     *  };
     * websocket.onmessage = function(event) {
     *  };
     * websocket.onerror = function(evnt) {
     * };
     * websocket.onclose = function(evnt) {
     * }
     */
    this.build = function () {
        JSloader.load($basePath + "js/sockjs-0.3.min.js");

        var websocket;
        if ('WebSocket' in window) {
            console.log("websocket连接方式1");
            websocket = new WebSocket("ws://" + document.location.host
                + url);
        } else if ('MozWebSocket' in window) {
            console.log("websocket连接方式2");
            websocket = new MozWebSocket("ws://" + document.location.host
                + url);
        } else {
            console.log("websocket连接方式3");
            websocket = new SockJS("http://" + document.location.host
                + "/sockjs" + url);
        }
        return websocket;
    }
}