/**
 * @author caixiaopeng
 * @create_datetime 2018/4/11 16:46
 */

function Lock() {
    this.waitFuncs = new Array();

    this.lock = function (func) {
        this.waitFuncs.push(func);
        if (this.waitFuncs.length == 1) {
            func();
        } else {
            console.log("锁住了...")
        }
    }

    this.unlock = function () {
        ArrayUtil.delByIndex(this.waitFuncs, 0);
        if (this.waitFuncs.length > 0){
            this.waitFuncs[0]();
        }
    }
}