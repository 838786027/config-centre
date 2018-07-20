/**
 * @author caixiaopeng
 * @create_datetime 2018/4/9 10:10
 */

/**
 * 依赖ace.sidebar.js、ace.sidebar-scroll-1.js、ace.submenu-hover.js
 * 可选依赖PermissionController.js <- enablePermissionLimit
 * 可选依赖FuncSwitch.js <- enableFuncSwitch
 * eg.
 * var menu = new Menu({
              containerSelector:"#sidebar",
              enablePermissionLimit:true,
              enableFuncSwitch:true,
              data:[
                  {
                      name:"Solr",
                      iconClass:"fa fa-table",
                      id:"js-navItem_solr",
                      permissionLimit:"SOLR",
                      funcSwitch:"SOLR",
                      subMenu:[
                          {
                              name:"表格",
                              id:"js-navItem_solr_table",
                              href:$basePath + "solr/table/webpage"
                          },
                          {
                              name:"批处理",
                              id:"js-navItem_solr_batch",
                              href:$basePath + "solr/batch/webpage"
                          }
                      ]
                  }, // !-- solr
                  {
                      name:"Hbase",
                      iconClass:"fa fa-table",
                      id:"js-navItem_hbase",
                      permissionLimit:"HBASE",
                      funcSwitch:"HBASE",
                      subMenu:[
                          {
                              name:"表格",
                              id:"js-navItem_hbase_table",
                              href:$basePath + "hbsae/table/webpage"
                          },
                          {
                              name:"批处理",
                              id:"js-navItem_hbase_batch",
                              href:$basePath + "hbase/batch/webpage"
                          }
                      ]
                  }, // !-- hbase
                  {
                      name:"Hive",
                      iconClass:"fa fa-table",
                      id:"js-navItem_hive",
                      permissionLimit:"HIVE",
                      funcSwitch:"HIVE",
                      subMenu:[
                          {
                              name:"表格",
                              id:"js-navItem_hive_table",
                              href:$basePath + "hive/table/webpage"
                          },
                          {
                              name:"批处理",
                              id:"js-navItem_hive_batch",
                              href:$basePath + "hive/batch/webpage"
                          }
                      ]
                  }, // !-- hive
                  {
                      name:"Zookeeper",
                      iconClass:"fa fa-folder-open",
                      id:"js-navItem_zk_tree",
                      permissionLimit:"ZK",
                      funcSwitch:"ZK",
                      href:$basePath + "zk/tree/webpage"
                  }, // !-- zookeeper
                  {
                      name:"Spark",
                      iconClass:"fa fa-cloud",
                      id:"js-navItem_spark",
                      permissionLimit:"SPARK",
                      funcSwitch:"SPARK",
                      subMenu:[
                          {
                              name:"提交任务",
                              id:"js-navItem_spark_submit",
                              href:$basePath + "spark/submit/webpage"
                          }
                      ]
                  }, // !-- spark
                  {
                      name:"Host",
                      iconClass:"fa fa-desktop",
                      id:"js-navItem_h",
                      permissionLimit:"H",
                      funcSwitch:"H",
                      subMenu:[
                          {
                              name:"主机配置",
                              id:"js-navItem_h_host_table",
                              href:$basePath + "host/table/webpage"
                          },
                          {
                              name:"Linux命令",
                              id:"js-navItem_h_host_table",
                              href:$basePath + "linux/cmd/webpage"
                          },
                          {
                              name:"Linux主机监控",
                              id:"js-navItem_h_linux_monitor",
                              href:$basePath + "linux/monitor/webpage"
                          }
                      ]
                  }, // !-- host
                  {
                      name:"ServiceMonitor",
                      iconClass:"fa fa-eye",
                      id:"js-navItem_servicemonitor",
                      permissionLimit:"SM",
                      funcSwitch:"SM",
                      href:$basePath + "servicemonitor/webpage"
                  }, // !-- servicemonitor
                  {
                      name:"大数据基础服务",
                      iconClass:"fa fa-leaf",
                      id:"js-navItem_bd",
                      permissionLimit:"BD",
                      funcSwitch:"BD",
                      subMenu:[
                          {
                              name:"安装",
                              id:"js-navItem_bd_install",
                              href:$basePath + "bd/install/webpage?init=true",
                              permissionLimit:"BD|INSTALL",
                              funcSwitch:"BD|INSTALL"
                          },
                          {
                              name:"监控",
                              id:"js-navItem_bd_monitor",
                              href:$basePath + "bd/monitor/webpage",
                              permissionLimit:"BD|MONITOR",
                              funcSwitch:"BD|MONITOR"
                          }
                      ]
                  } // !-- 大数据基础服务
              ] // !-- data
          }); // !-- Menu
 */
function Menu(params) {
    this._containerSelector = params["containerSelector"];
    this._data = params["data"];
    this._dataMap = new Object(); // 以id为key
    this._enablePermissionLimit =  params["enablePermissionLimit"];
    this._enableFuncSwitch = params["enableFuncSwitch"];
    this._$menu;

    this.init = function () {
        this._parse(this._data, null);
        $(this._containerSelector).addClass("sidebar").addClass("responsive");
        $(this._containerSelector).html(""); // 清空
        this._$menu = $(this.constructor._DOM_MENU);
        $(this._containerSelector).append(this._$menu);
        for (var i in this._data) {
            var $item = this._createItem(this._data[i]);
            if ($item != null) {
                this._$menu.append($item);
            }
        }

        // 加载js依赖
        JSloader.syncLoad($basePath + "ace_res/assets/js/ace/ace.sidebar.js");
        JSloader.syncLoad($basePath + "ace_res/assets/js/ace/ace.sidebar-scroll-1.js");
        // JSloader.syncLoad($basePath + "ace_res/assets/js/ace/ace.submenu-hover.js");
    }

    this.open = function (itemId) {
        var item =  this._dataMap[itemId];
        var parent = item["parent"];
        if (item != null) {
            $("#" + item["id"]).addClass("active");
        }
        if (parent != null) {
            $("#" + parent["id"]).addClass("open");
        }
    }

    this.tips = function (itemId, tips) {
        var item = this._dataMap[itemId];
        if (item != null) {
            var $item = $("#" + item["id"]).children("a");
            var $tips = $item.find(".js_tips");
            if (tips != null) {
                if ($tips == null || $tips.length == 0) {
                    $tips = $(this.constructor._DOM_TIPS);
                    $item.append($tips);
                }
                $tips.text(tips);
            } else {
                if ($tips != null && $tips.length > 0) {
                    return $tips.text();
                }
            }
        }
    }
    
    this.clearTips = function (itemId) {
        var item = this._dataMap[itemId];
        if (item != null) {
            var $item = $("#" + item["id"]).children("a");
            var $tips = $item.find(".js_tips");
            if ($tips != null && $tips.length > 0) {
                $tips.remove();
            }
        }
    }

    this._parse = function (data, parent) {
        for (var i in data) {
            this._dataMap[data[i]["id"]] = data[i];
            data[i]["parent"] = parent;
            if (data[i]["subMenu"] != null && data[i]["subMenu"].length > 0) {
                this._parse(data[i]["subMenu"], data[i]);
            }
        }
    }

    this._createItem = function(item) {
        var $item = null;
        if (item["subMenu"] == null || item["subMenu"].length == 0) {
            var itemStr = this.constructor._DOM_ITEM;
            itemStr = StringUtil.replaceAll(itemStr, "\\$id", item["id"]);
            itemStr = StringUtil.replaceAll(itemStr, "\\$href", item["href"]);
            itemStr = StringUtil.replaceAll(itemStr, "\\$iconClass", item["iconClass"]);
            itemStr = StringUtil.replaceAll(itemStr, "\\$itemName", item["name"]);
            $item = $(itemStr);
        } else {
            var itemStr = this.constructor._DOM_ITEM_WITH_SUB_MENU;
            itemStr = StringUtil.replaceAll(itemStr, "\\$id", item["id"]);
            itemStr = StringUtil.replaceAll(itemStr, "\\$iconClass", item["iconClass"]);
            itemStr = StringUtil.replaceAll(itemStr, "\\$itemName", item["name"]);
            $item = $(itemStr);
            for (var j in item["subMenu"]) {
                item["subMenu"][j]["iconClass"] = "glyphicon glyphicon-comment";
                var $subItem = this._createItem(item["subMenu"][j]);
                if ($subItem != null) {
                    $item.find(".submenu").append($subItem);
                }
            }
        }
        if (this._enablePermissionLimit) {
            if (item["permissionLimit"] != null){
                var key = item["permissionLimit"];
                var actions;
                if (item["subMenu"] == null || item["subMenu"].length == 0) {
                    actions = ["+class:grey", "-attr:href"];
                    PermissionController.check($item.find("a"), key, actions);
                    actions = ["-class:" + item["iconClass"], "+class:fa fa-ban"];
                    PermissionController.check($item.find(".menu-icon"), key, actions);
                } else {
                    var actions = ["+class:grey","-class:dropdown-toggle"];
                    PermissionController.check($item.find("a"), key, actions);
                    actions = ["-class:" + item["iconClass"], "+class:fa fa-ban"];
                    PermissionController.check($item.find(".menu-icon"), key, actions);
                }
            }
        }
        if (this._enableFuncSwitch) {
            if (item["funcSwitch"] != null){
                var key = item["funcSwitch"];
                if (!FuncSwitch.isEnable(key)){
                    return null;
                }
            }
        }
        return $item;
    }
}

Menu._DOM_ITEM = "<li id=\"$id\">" +
    "          <a href=\"$href\">\n" +
    "            <i class=\"menu-icon $iconClass\"></i>\n" +
    "            <span class=\"menu-text\">$itemName</span>\n" +
    "          </a>\n" +
    "          <b class=\"arrow\"></b>\n" +
    "        </li>";

Menu._DOM_ITEM_WITH_SUB_MENU = "<li id=\"$id\">\n" +
    "          <a href=\"javascript:void(0);\" class=\"dropdown-toggle\">\n" +
    "            <i class=\"menu-icon $iconClass\"></i>\n" +
    "            <span class=\"menu-text\">$itemName </span>\n" +
    "            <b class=\"arrow fa fa-angle-down\"></b>\n" +
    "          </a>\n" +
    "          <b class=\"arrow\"></b>\n" +
    "          <ul class=\"submenu\"></ul>"

Menu._DOM_MENU = "<ul class=\"nav nav-list\"></ul>"

Menu._DOM_TIPS = "<span class=\"js_tips badge badge-important\"></span>"