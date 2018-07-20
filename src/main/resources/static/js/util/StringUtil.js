/**
 * @author caixiaopeng
 * @create_datetime 2018/4/11 13:47
 */

function StringUtil() {

}

StringUtil.parseJson = function (str) {
    // 注：返回的json对象中，原字符串中的\r\n，\n,\r全都被替换成</br>
    str=this.replaceAll(str,"\\r\\n","</br>");
    str=this.replaceAll(str,'\\n',"</br>");
    str=this.replaceAll(str,'\\r',"</br>");
    return eval("("+str+")");
}

/**
 * 采用正则表达式匹配
 * 注意：保留字符
 */
StringUtil.replaceAll = function (text, regText, repText) {
    var regExp = new RegExp(regText, "g");
    return text.replace(regExp, repText);
}

/**
 * 采用正则表达式匹配
 * 注意：保留字符
 */
StringUtil.startWith = function (text, startText) {
    var reg=new RegExp("^" + startText);
    return reg.test(text) > 0;
}

/**
 * 采用正则表达式匹配
 * 注意：保留字符
 */
StringUtil.endWith = function (text, endText) {
    var reg=new RegExp(endText + "$");
    return reg.test(text) > 0;
}