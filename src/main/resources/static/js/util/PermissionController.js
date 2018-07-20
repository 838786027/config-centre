/**
 * 权限控制器
 * 依赖userPermissionSet
 * 依赖dom：< class=".js_permission-limit" data-permission-limit="$key" data-permission-limit-actions="">
 *      data-permission-limit-actions限制时的动作
 * @author caixiaopeng
 * @create_datetime 2018/3/29 10:27
 */

function PermissionController() {
}

PermissionController.checkAll = function () {
    var limitEles = $(".js_permission-limit"); // 被限制的元素
    for (var i = 0; i < limitEles.size(); i++) {
        var ele = limitEles.eq(i);
        if (!this.isEnable(ele.attr("data-permission-limit"))) {
            var actions = ele.attr("data-permission-limit-actions");
            if (actions != null) {
                actions = actions.split(",");
                this._action(ele, actions);
            }
        }
    }
}

/**
 * @returns null : 元素被移除
 */
PermissionController.check = function ($ele, key, actions) {
    if ($ele == null || key == null || actions == null) {
        return $ele;
    }
    if (!this.isEnable(key)) {
        // 启动限制动作
        return this._action($ele, actions);
    }
    return $ele;
}

PermissionController.isEnable = function (key) {
    return $.inArray(key, userPermissionSet) >= 0;
}

/**
 * @returns null : 元素被移除
 */
PermissionController._action = function ($ele, actions) {
    for (var i in actions) {
        if (actions[i] == "remove") {
            $ele.remove();
            return null;
        } else if (StringUtil.startWith(actions[i], "\\+class:")) {
            $ele.addClass(actions[i].split("+class:")[1]);
        } else if (StringUtil.startWith(actions[i], "-class:")) {
            $ele.removeClass(actions[i].split("-class:")[1]);
        } else if (StringUtil.startWith(actions[i], "-attr:")) {
            $ele.removeAttr(actions[i].split("-attr:")[1]);
        } else if (actions[i] == "-click") {
            $ele.addClass("disabled");
            $ele.attr("disabled","true");
            $ele.unbind();
        }
    }
    return $ele;
}

window.onload = PermissionController.checkAll();