function DomUtil() {
}

DomUtil.deepClone = function (node) {
    var $cloneNode = $(node).clone(true);
    $cloneNode.attr("id", "");
    $cloneNode.css("display", "");
    return $cloneNode;
}

DomUtil.new = function () {
    return NewUtil;
}

function NewUtil() {
}

/**
 * params ->
 * {"text":"",
     *  "attrs":{...}
     * }
 */
NewUtil.opt = function (params) {
    var attrs = "";
    for (var key in params.attrs) {
        attrs += " " + key + "=" + "\"" + params.attrs[key] + "\"";
    }
    return $("<option" + attrs + ">" + params.text + "</option>");
}

/**
 * params ->
 * {"text":"",
     *  "attrs":{...}
     * }
 */
NewUtil.div = function (params) {
    var attrs = "";
    for (var key in params.attrs) {
        attrs += " " + key + "=" + "\"" + params.attrs[key] + "\"";
    }
    return $("<option" + attrs + ">" + params.text + "</option>");
}