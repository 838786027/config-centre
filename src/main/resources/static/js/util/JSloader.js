/**
 * @author caixiaopeng
 * @create_datetime 2018/4/11 11:37
 */

function JSloader() {
}

JSloader._jsCache = new Array();
JSloader._loadingCount = 0; // 正在加载的数量
JSloader._waitFuncs = new Array(); // 等待执行
JSloader._lock = new Lock();

JSloader.syncLoad = function (src) {
    if ($.inArray(src, this._jsCache) < 0) {
        // console.log("正在加载..." + src);
        $.ajax({
            url: src,
            async: false,
            dataType: "script",
            success: function () {
            }
        });
        this._jsCache.push(src);
    }
}

JSloader.load = function (src, callback) {
    if ($.inArray(src, this._jsCache) < 0) {
        // console.log("正在加载..." + src);
        this._loadingCount++;
        $.getScript(src).complete(function(_this) {
            return function () {
                _this._jsCache.push(src);
                _this._loadingCount--;
                // console.log(src + "加载完毕 -> " + _this._loadingCount);
                // console.log("回调 -> " + _this._waitFuncs.length);
                // console.log(_this._waitFuncs);
                if (_this._loadingCount == 0) {
                    _this._awaken();
                }
                if (callback != null) {
                    callback();
                }
            }
        }(this));
    }
}

JSloader.wait = function (func) {
    if (this._loadingCount == 0) {
        func();
    } else {
        this._lock.lock(function (_this, func) {
            return function () {
                _this._waitFuncs.push(func);
                _this._lock.unlock();
            }
        }(this, func));
    }
}

JSloader._awaken = function () {
    this._lock.lock(function (_this) {
        return function () {
            // console.log("实际回调 -> " + _this._waitFuncs.length);
            // console.log(_this._waitFuncs);
            var waitFuncs = _this._waitFuncs;
            _this._waitFuncs = new Array();
            _this._lock.unlock();
            for (var i in waitFuncs) {
                waitFuncs[i]();
            }
        }
    }(this));
}
