/**
 * @author caixiaopeng
 * @create_datetime 2018/4/17 17:04
 */

function DateUtil () {

}

DateUtil.now = function () {
    return new Date();
}

DateUtil.format = function (date, format) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
}

DateUtil.addMinutes = function (date, m) {
    date.setMinutes(date.getMinutes() + m);
    return date;
};

DateUtil.addDays = function (date, d) {
    date.setDate(date.getDate() + d);
    return date;
};

DateUtil.addWeeks = function (date, w) {
    date.addDays(w * 7);
    return date;
};

DateUtil.addMonths = function (date, m) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + m);
    if (date.getDate() < d)
        date.setDate(0);
    return date;
};

DateUtil.addYears = function (date, y) {
    var m = date.getMonth();
    date.setFullYear(date.getFullYear() + y);
    if (m < date.getMonth()) {
        date.setDate(0);
    }
    return date;
};