/**
 * 功能开关
 * 依赖funcSet
 * 依赖NormalUtil.js
 * 依赖dom：< class=".js_func-switch" data-func-switch="$key">
 *
 * @author caixiaopeng
 * @create_datetime 2018/3/29 10:27
 */

function FuncSwitch() {
}

FuncSwitch.checkAll = function () {
    var limitEles = $(".js_func-switch"); // 被限制的元素
    for (var i = 0; i < limitEles.size(); i++) {
        var ele = limitEles.eq(i);
        this.check(ele, attr("data-func-switch"));
    }
}

/**
 * @returns null : 元素被移除
 */
FuncSwitch.check = function ($ele, key) {
    if (!this.isEnable(key)) {
        $ele.remove();
        $ele = null;
    }
    return $ele;
}

FuncSwitch.isEnable = function (key) {
    return $.inArray(key, funcSet) >= 0;
}

window.onload = FuncSwitch.checkAll();