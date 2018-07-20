/**
 * @author caixiaopeng
 * @create_datetime 2018/4/11 13:41
 */

function CSSloader() {

}

CSSloader._cssCache = new Array();

CSSloader.load = function (href) {
    if ($.inArray(href, this._cssCache) < 0) {
        $("head").append("<link>");
        var css = $("head").children(":last");
        css.attr({
            rel: "stylesheet",
            type: "text/css",
            href: href
        });
        this._cssCache.push(href);
    }
}