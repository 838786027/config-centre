
function CollectionUtil() {

}

/**
 * CollectionUtils使用的入口函数
 * @param collection
 * @param fun
 */
CollectionUtil.stream = function(collection) {
    return new CollectionStream(collection);
}

function CollectionStream(collection) {
    this._collection = collection;
    this._opList = new Array();
    this._isArray = collection instanceof Array;
    /**
     * 立即运行
     * @param func(collection[i], i)
     */
    this.forEach = function (func) {
        for (var i in this._collection) {
            var e = this._collection[i];
            func(e, i);
        }
        return this;
    }

    /**
     *
     * @param func return boolean
     */
    this.filter = function (func) {
        this._opList.push(new Op(Op.type.FILTER, func));
        return this;
    }

    /**
     * collection元素数量不变
     * @param func
     */
    this.map = function (func) {
        this._opList.push(new Op(Op.type.MAP, func));
        return this;
    }

    this.collect = function () {
        var _this = this;
        var newCollection = null;
        if (this._isArray) {
            newCollection = new Array();
        } else {
            newCollection = new Object();
        }
        for (var i in this._collection) {
            var e = this._collection[i];
            invokeOpList(e, i);
        }

        function invokeOpList(e, i) {
            var newE = e;
            for (var j in _this._opList) {
                var op = _this._opList[j];
                switch (op.type) {
                    case Op.type.FILTER:
                        if (!op.func(e, i)) {
                            // 抛弃该数据
                            return ;
                        }
                        break;
                    case Op.type.MAP:
                        newE = op.func(e, i);
                        break;
                    default:
                        break;
                }
            }
            if (_this._isArray) {
                newCollection.push(newE);
            } else {
                newCollection[i] = newE;
            }
        }

        this._opList = new Array();
        return newCollection;
    }
}

/**
 *
 * @param type Op.type
 * @param func
 * @constructor
 */
function Op(type, func) {
    this.type = type;
    this.func = func;
}

Op.type = {
    FILTER : "filter",
    MAP : "map"
};

function ArrayUtil() {
    
}

ArrayUtil.join = function (array1, array2) {
    for (var i in array2) {
        array1.push(array2[i]);
    }
    return array1;
}

ArrayUtil.del = function (array, ele) {
    array.splice($.inArray(ele,array),1);
}

ArrayUtil.delByIndex = function (array, index) {
    array.splice(index,1);
}
