/**
 * @author caixiaopeng
 * @create_datetime 2018/5/14 10:17
 */

/**
 * 用于解析
 * {
 *  "returnCode": num,
 *  "returnMsg": str,
 *  "data": obj
 * }
 * @constructor
 */
function ResponseUtil() {
    
}

ResponseUtil.isSuccess = function (response) {
    return response["returnCode"] == 0;
}

ResponseUtil.isFail = function (response) {
    return response["returnCode"] == 1;
}

/**
 *
 * @param callback ->
 * {
 *  "success": func,
 *  "fail": func,
 *  "complete": func
 *  "httpFail": func,
 *  "httpComplete": func
 * }
 * @constructor
 */
function ResponseCallBack(callback) {
    this.httpSuccess =  function (response) {
        if (callback["complete"] != null) {
            callback["complete"](response);
        }
        if (ResponseUtil.isSuccess(response)) {
            if (callback["success"] != null) {
                callback["success"](response);
            }
        } else if (ResponseUtil.isFail(response)) {
            if (callback["fail"] != null) {
                callback["fail"](response);
            }
        }
    }

    this.httpFail = callback["httpFail"];
    this.httpComplete = callback["httpComplete"];
}