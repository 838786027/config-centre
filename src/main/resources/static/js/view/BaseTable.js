/**
 * @author caixiaopeng
 * @create_datetime 2018/4/10 16:44
 */

/**
 * 依赖jquery-ui.css、ui.jqgrid.css、jquery-ui-timepicker-addon.css、jquery-ui.js、jquery.jqGrid.src.js、grid.locale-en.js、jquery-ui-timepicker-addon.js
 * @param args
 *  {"containerSelector":"xxx",
 *   "id":"xxx",
 *   "name":"xxx",
 *   "colModel":[{
 *      "name":"xxx",
 *      "index":"xxx",
 *      "width':xxx, // 百分比，eg.5 代表该列占表格总宽的百分之五
 *      "key":xxx,
 *      "editable":xxx,
 *      "type":"",
 *      "range":true // 是否为范围类型
 *   }],
 *   "options":{"enableAdd":true,"enableDel":true,"enableEdit":true}},
 *   "autoWidthByContext" : true,
 *   "defaultSortColumn":"xxx",
 *   "defaultSortType":"desc',
 *   "rowNum":10,
 *   "url":"xxx",
 *   "editUrl":"xxx",
 *   "extraParam": {"xxx":"xxx"},
 *   "postExtraParam": {"xxx":"xxx"},
 *   "editExtraParam": {"xxx":"xxx"},
 *   "delExtraParam": {"xxx":"xxx"},
 *   "addExtraParam": {"xxx":"xxx"},
 *   "listener":{
 *          "loadComplete" : "xxx"
 *    }
 * @constructor
 */
function BaseTable(args) {
    this._tableName = args["name"];
    this._tableId = args["id"];
    this._navId = args["id"] + "_nav";
    this._selector = {
        container:args["containerSelector"],
        table: "#" + this._tableId,
        nav: "#" + this._navId,
        gbox: "#gbox_" + this._tableId
    };
    this._colModel = args["colModel"];
    this._options = args["options"];
    this._autoWidthByContext = args["autoWidthByContext"] || false; // 是否由内容来自适应宽度
    this._defaultSortColumn = args["defaultSortColumn"];
    this._defaultSortType = args["defaultSortType"] || "asc";
    this._rowNum = args["rowNum"] || 10;
    this._url = args["url"];
    this._editUrl = args["editUrl"];
    args["extraParam"] = args["extraParam"] == null ? {} : args["extraParam"];
    this._postExtraParam = $.extend(args["extraParam"], args["postExtraParam"] == null ? {} : args["postExtraParam"]);
    this._editExtraParam = $.extend(args["extraParam"], args["editExtraParam"] == null ? {} : args["editExtraParam"]);
    this._delExtraParam = $.extend(args["extraParam"], args["delExtraParam"] == null ? {} : args["delExtraParam"]);
    this._addExtraParam = $.extend(args["extraParam"], args["addExtraParam"] == null ? {} : args["addExtraParam"]);
    this._listener = {
        loadComplete : args["listener"]!=null && $.isFunction(args["listener"]["loadComplete"]) ? args["listener"]["loadComplete"] : null,
        // 事件监听器
        onCellSelect: args["listener"]!=null && $.isFunction(args["listener"]["onCellSelect"]) ? args["listener"]["onCellSelect"] : null
    }

    this._$gridView;
    this._colNames;

    this.init = function() {
        CSSloader.load($basePath + "ace_res/assets/css/jquery-ui.css");
        CSSloader.load($basePath + "ace_res/assets/css/ui.jqgrid.css");
        CSSloader.load($basePath + "ace_res/assets/css/jquery-ui-timepicker-addon.css");
        JSloader.load($basePath + "ace_res/assets/js/jquery-ui.js", function () {
            JSloader.load($basePath + "ace_res/assets/js/jquery-ui-timepicker-addon.js", function () {
                JSloader.load($basePath + "ace_res/assets/js/jquery.ui.datepicker-zh-CN.js");
                JSloader.load($basePath + "ace_res/assets/js/jquery-ui-timepicker-zh-CN.js");
            });
        });
        JSloader.load($basePath + "ace_res/assets/js/jqGrid/my.jqGrid.js");
        JSloader.load($basePath + "ace_res/assets/js/jqGrid/i18n/grid.locale-cn.js");

        JSloader.wait(function (_this) {
            return function () {
                // 添加view
                _this._createView();

                // resize to fit page size
                $(window).on('resize.jqGrid', function(_this){
                    return function(){
                        _this._$gridView.jqGrid('setGridWidth',
                            $(_this._selector.container).width());
                    }
                }(_this));

                _this._initCols();
                _this._initGrid();

                $(window).triggerHandler('resize.jqGrid');// trigger window resize to

                _this._initNav();

                // resize on sidebar collapse/expand
                var parent_column = _this._$gridView.closest('[class*="col-"]');
                $(document).on('settings.ace.jqGrid',function(_this){
                    return function(ev, event_name, collapsed) {
                        if (event_name === 'sidebar_collapsed'
                            || event_name === 'main_container_fixed') {
                            // setTimeout is for webkit only to give time for DOM
                            // changes and then redraw!!!
                            setTimeout(function () {
                                _this._$gridView.jqGrid('setGridWidth',
                                    parent_column.width());
                            }, 0);
                        }
                    };
                }(_this));
                $(document).one('ajaxloadstart.page', function(_this){
                    return function(e) {
                        _this._$gridView.jqGrid('GridUnload');
                        $('.ui-jqdialog').remove();
                    };
                }(_this));
            }
        }(this));
    } // !-- init

    this.hidden = function () {
        $(this._selector.gbox).css("display", "none");
    }

    this.show = function () {
        $(this._selector.gbox).css("display", "block");
    }
    
    this.jqGrid = function (method, args) {
        return $(this._selector.table).jqGrid(method, args);
    }

    this.trigger = function (method) {
        return $(this._selector.table).trigger(method);
    }

    this.getRowData = function (rowId) {
        return $(this._selector.table).jqGrid('getRowData', rowId);
    }

    this.setRowData = function (rowId, row) {
        return $(this._selector.table).jqGrid('setRowData',rowId, row);
    }
    
    this.updateRowData = function (rowId, newRow) {
        var rowOri = this.getRowData(rowId);
        for(var field in newRow){
            rowOri[field] = newRow[field];
        }
        this.setRowData(rowId, rowOri);
    }
    
    /*this._setGridParam = function (gridParam) {
        $(this._selector.table).jqGrid("setGridParam", gridParam);
    } */

    this.reload = function(args) {
        if (args != null) {
            if (args["extraParam"] != null) {
                args["postExtraParam"] = $.extend(args["extraParam"], args["postExtraParam"] == null ? {} : args["postExtraParam"]);
                args["editExtraParam"] = $.extend(args["extraParam"], args["editExtraParam"] == null ? {} : args["editExtraParam"]);
                args["delExtraParam"] = $.extend(args["extraParam"], args["delExtraParam"] == null ? {} : args["delExtraParam"]);
                args["addExtraParam"] = $.extend(args["extraParam"], args["addExtraParam"] == null ? {} : args["addExtraParam"]);
            }
            if (args["postExtraParam"] != null) {
                this._postExtraParam = args["postExtraParam"];
                $(this._selector.table).jqGrid("setGridParam", {postData: this._postExtraParam});
            }
            if (args["editExtraParam"] != null) {
                this._editExtraParam = args["editExtraParam"];
                var gridParam = $(this._selector.table).jqGrid("getGridParam");
                gridParam.colModel[1].formatoptions.editOptions.editData = this._editExtraParam;
                $(this._selector.table).jqGrid("setGridParam", gridParam);
            }
            if (args["delExtraParam"] != null) {
                this._delExtraParam = args["delExtraParam"];
                var gridParam = $(this._selector.table).jqGrid("getGridParam");
                gridParam.colModel[1].formatoptions.delOptions.delData = this._delExtraParam;
                $(this._selector.table).jqGrid("setGridParam", gridParam);
            }
            if (args["addExtraParam"] != null) {
                this._addExtraParam = args["addExtraParam"];
            }
            if (args["name"] != null) {
                this._tableName = args["name"];
                $(this._selector.table).jqGrid("setCaption", this._tableName);
            }
        }
        this.trigger("reloadGrid");
    }

    this._createView = function () {
        this._$gridView = $("<table id=\"" + this._tableId + "\"></table>");
        $(this._selector.container).append(this._$gridView);
        $(this._selector.container).append($("<div id=\"" + this._navId + "\"></div>"));
    }

    this._initCols = function () {
        this._colNames = new Array();
        var tmp = this._colModel;
        this._colModel = new Array();
        // TODO if (this._options["enableDel"]) {
        this._colModel.push({
            name : 'myac',
            index : '',
            width : 80,
            fixed : true,
            sortable : false,
            resize : false,
            formatter : 'actions',
            formatoptions : {
                editbutton:this._options["enableEdit"],
                delbutton:this._options["enableDel"],
                keys : true,
                delOptions : {
                    recreateForm : true,
                    beforeShowForm : this._beforeDeleteCallback,
                    delData: this._delExtraParam
                },
                editOptions: {
                    editData: this._editExtraParam
                }
            }
        });
        this._colNames.push('');
        for (var i in tmp) {
            if (tmp[i]["range"] && tmp[i]["type"] != "date") {
                tmp[i]["sorttype"] = "int";
                tmp[i]["searchrules"] = {
                    "required": true,
                    "number" : true
                }
            }
            switch (tmp[i]["type"]) {
                case "text" :
                    tmp[i]["edittype"] = "text";
                    break;
                case "textarea":
                    tmp[i]["edittype"] = "textarea";
                    break;
                case "select":
                    tmp[i]["edittype"] = "select";
                    break;
                case "checkbox":
                    tmp[i]["edittype"] = "checkbox";
                    tmp[i]["editoptions"] = {value:"Yes:No"};
                    tmp[i]["unformat"] = this._aceSwitch;
                    break;
                case "password":
                    tmp[i]["edittype"] = "password";
                    break;
                case "date":
                    tmp[i]["edittype"] = "text";
                    tmp[i]["unformat"] = this._pickDatetime;
                    tmp[i]["sorttype"] = "date";
                    tmp[i]["searchoptions"] = {
                        // dataInit is the client-side event that fires upon initializing the toolbar search field for a column
                        // use it to place a third party control to customize the toolbar
                        dataInit: function (element) {
                            $(element).datetimepicker({
                                timeFormat: "HH:mm:ss",
                                dateFormat: "yy-mm-dd",
                                autoclose : true
                            });
                        }
                    }
                    break;
            }
            this._colNames.push(tmp[i]["name"]);
            tmp[i]["name"] = tmp[i]["index"];
            this._colModel.push(tmp[i]);
        }
    }

    this._initGrid = function () {
        this._$gridView.jqGrid(
            {
                datatype : "json", // 将这里改为使用JSON数据
                search : true,
                url : this._url, // 这是Action的请求地址
                mtype : 'POST',
                height : this._rowNum * this.constructor._ROW_HEIGHT,
                sortname: this._defaultSortColumn,
                sortorder: this._defaultSortType,
                colNames : this._colNames,
                colModel : this._colModel,
                viewrecords : true,
                rowNum : this._rowNum,
                pager : this._selector.nav,
                altRows : true,
                multiselect : true,
                multiboxonly : true,
                postData : this._postExtraParam,
                loadComplete : function (_this) {
                    return function(event) {
                        var table = this;
                        setTimeout(function() {
                            _this._styleCheckbox(table);
                            _this._updateActionIcons(table);
                            _this._updatePagerIcons(table);
                            _this._enableTooltips(table);
                        }, 0);
                    }
                }(this),
                loadError : function() {
                    alert("loadError");
                },
                ajaxGridOptions : {
                    complete : function (_this) {
                        return function(response) {
                            var responseText = response["responseText"];
                            responseText = $.parseJSON( responseText );
                            if (_this._listener.loadComplete != null) {
                                _this._listener.loadComplete(responseText);
                            }
                            if (_this._autoWidthByContext) {
                                _this._resizeColWidth();
                            }
                        }
                    }(this)
                },
                onCellSelect: function(_this) {
                    return function(rowId,iCol,cellContent,e) {
                        if(_this._listener.onCellSelect != null) {
                            _this._listener.onCellSelect(rowId, iCol, cellContent, e);
                        }
                    }
                }(this),
                editurl : this._editUrl,
                caption : this._tableName
            });
    }

    this._initNav = function () {
        // make the grid get the
        // correct size
        // navButtons
        var editExtraParam = {};
        if (this._editExtraParam != null) {
            for (var key in this._editExtraParam) {
                editExtraParam[key] = function(_this) {
                    return function () {
                        return _this._editExtraParam[key];
                    }
                }(this);
            }
        }
        var addExtraParam = {};
        if (this._addExtraParam != null) {
            for (var key in this._addExtraParam) {
                addExtraParam[key] = function(_this, key) {
                    return function () {
                        console.log(_this._addExtraParam[key]);
                        return _this._addExtraParam[key];
                    }
                }(this, key);
            }
        }
        this._$gridView.jqGrid(
            'navGrid',
            this._selector.nav,
            { // navbar options
                edit : false,
                editicon : 'ace-icon fa fa-pencil blue',
                add : this._options["enableAdd"],
                addicon : 'ace-icon fa fa-plus-circle purple',
                del : this._options["enableDel"],
                delicon : 'ace-icon fa fa-trash-o red',
                search : true,
                searchicon : 'ace-icon fa fa-search orange',
                refresh : true,
                refreshicon : 'ace-icon fa fa-refresh green',
                view : true,
                viewicon : 'ace-icon fa fa-search-plus grey',
            },
            { // edit record form
                recreateForm : true,
                beforeShowForm :function (_this) {
                    return function(e) {
                        var form = $(e[0]);
                        form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
                        _this._style_edit_form(form);
                    }
                }(this),
                // TODO reload的时候没有更新该值
                editData: editExtraParam
            },
            {   //new record form
                //width: 700,
                closeAfterAdd: true,
                recreateForm: true,
                viewPagerButtons: false,
                beforeShowForm :function (_this) {
                    return function(e) {
                        var form = $(e[0]);
                        form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
                            .wrapInner('<div class="widget-header" />')
                        _this._style_edit_form(form);
                    }
                }(this),
                // TODO reload的时候没有更新该值
                editData: addExtraParam
            },
            { // delete record form
                recreateForm : true,
                beforeShowForm :function (_this) {
                    return function(e) {
                        var form = $(e[0]);
                        if (form.data('styled'))
                            return false;
                        form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
                        _this._style_delete_form(form);
                        form.data('styled', true);
                    }
                }(this),
                onClick : function(e) {
                    // alert(1);
                }
            },
            { // search form
                multipleSearch: true,
                multipleGroup: true,
                showQuery: true,
                recreateForm : true,
                afterShowSearch : function (_this) {
                    return function (e) {
                        var form = $(e[0]);
                        form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />');
                        _this._style_search_form(form);
                    }
                }(this),
                afterRedraw : function (_this) {
                    return function() {
                        _this._style_search_filters($(this));
                    }}(this),
                closeAfterSearch : false
            },
            { // view record form
                recreateForm : true,
                beforeShowForm : function (_this) {
                    return function(e) {
                        var form = $(e[0]);
                        form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                    }
                }(this)
            });
    }

    // switch element when editing inline
    this._aceSwitch = function(cellvalue, options, cell) {
        setTimeout(function() {
            $(cell).find('input[type=checkbox]').addClass(
                'ace ace-switch ace-switch-5').after(
                '<span class="lbl"></span>');
        }, 0);
    }

    this._pickDatetime = function (cellvalue, options, cell) {
        setTimeout(function() {
            $(cell).find('input[type=text]').datetimepicker({
                timeFormat: "HH:mm:ss",
                dateFormat: "yy-mm-dd",
                autoclose : true
            });
        }, 0);
    }

    // enable datepicker
    this._pickDate = function(cellvalue, options, cell) {
        setTimeout(function() {
            $(cell).find('input[type=text]').datepicker({
                dateFormat : "yy-mm-dd",
                autoclose : true
            });
        }, 0);
    }

    this._pickTime = function(cellvalue, options, cell) {
        setTimeout(function() {
            $(cell).find('input[type=text]').timepicker({
                timeFormat : "HH:mm:ss",
                autoclose : true
            });
        }, 0);
    }

    this._style_edit_form = function(form) {
        form.find('input[type=checkbox]').addClass('ace ace-switch ace-switch-5').after('<span class="lbl"></span>');

        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm').find('[class*="-icon"]').hide();// ui-icon,
        // s-icon
        buttons.eq(0).addClass('btn-primary').prepend(
            '<i class="ace-icon fa fa-check"></i>');
        buttons.eq(1).prepend('<i class="ace-icon fa fa-times"></i>')

        buttons = form.next().find('.navButton a');
        buttons.find('.ui-icon').hide();
        buttons.eq(0).append('<i class="ace-icon fa fa-chevron-left"></i>');
        buttons.eq(1).append('<i class="ace-icon fa fa-chevron-right"></i>');
    }

    this._style_edit_form_subgrid = function(form) {
        form.find('input[name=start_time]').timepicker({
            timeFormat : "HH:mm:ss",
            autoclose : true
        });
        form.find('input[name=end_time]').timepicker({
            timeFormat : "HH:mm:ss",
            autoclose : true
        });
        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm').find('[class*="-icon"]').hide();// ui-icon,
        // s-icon
        buttons.eq(0).addClass('btn-primary').prepend(
            '<i class="ace-icon fa fa-check"></i>');
        buttons.eq(1).prepend('<i class="ace-icon fa fa-times"></i>')

        buttons = form.next().find('.navButton a');
        buttons.find('.ui-icon').hide();
        buttons.eq(0).append('<i class="ace-icon fa fa-chevron-left"></i>');
        buttons.eq(1).append('<i class="ace-icon fa fa-chevron-right"></i>');
    }

    this._style_delete_form = function(form) {
        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm btn-white btn-round').find(
            '[class*="-icon"]').hide();// ui-icon, s-icon
        buttons.eq(0).addClass('btn-danger').prepend(
            '<i class="ace-icon fa fa-trash-o"></i>');
        buttons.eq(1).addClass('btn-default').prepend(
            '<i class="ace-icon fa fa-times"></i>')
    }

    this._style_search_filters = function (form) {
        form.find('.delete-rule').val('X');
        form.find('.add-rule').addClass('btn btn-xs btn-primary');
        form.find('.add-group').addClass('btn btn-xs btn-success');
        form.find('.delete-group').addClass('btn btn-xs btn-danger');
    }

    this._style_search_form = function(form) {
        var dialog = form.closest('.ui-jqdialog');
        var buttons = dialog.find('.EditTable')
        buttons.find('.EditButton a[id*="_reset"]').addClass(
            'btn btn-sm btn-info').find('.ui-icon').attr('class',
            'ace-icon fa fa-retweet');
        buttons.find('.EditButton a[id*="_query"]').addClass(
            'btn btn-sm btn-inverse').find('.ui-icon').attr('class',
            'ace-icon fa fa-comment-o');
        buttons.find('.EditButton a[id*="_search"]').addClass(
            'btn btn-sm btn-purple').find('.ui-icon').attr('class',
            'ace-icon fa fa-search');
    }

    this._beforeDeleteCallback = function(_this) {
        return function(e) {
            var form = $(e[0]);
            if (form.data('styled'))
                return false;
            form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
            _this._style_delete_form(form);
            form.data('styled', true);
        }
    }(this)

    this._beforeEditCallback = function(_this) {
        return function (e) {
            var form = $(e[0]);
            form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />');
            _this._style_edit_form(form);
        }
    }(this)

    this._styleCheckbox = function (table) {
    }

    this._updateActionIcons = function(table) {
    }

    // replace icons with FontAwesome icons like above
    this._updatePagerIcons = function(table) {
        var replacement = {
            'ui-icon-seek-first' : 'ace-icon fa fa-angle-double-left bigger-140',
            'ui-icon-seek-prev' : 'ace-icon fa fa-angle-left bigger-140',
            'ui-icon-seek-next' : 'ace-icon fa fa-angle-right bigger-140',
            'ui-icon-seek-end' : 'ace-icon fa fa-angle-double-right bigger-140'
        };
        $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon')
            .each(
                function() {
                    var icon = $(this);
                    var $class = $.trim(icon.attr('class').replace(
                        'ui-icon', ''));
                    if ($class in replacement)
                        icon.attr('class', 'ui-icon '
                            + replacement[$class]);
                });
    }

    this._enableTooltips = function(table) {
        $('.navtable .ui-pg-button').tooltip({
            container : 'body'
        });
        $(table).find('.ui-pg-div').tooltip({
            container : 'body'
        });
    }

    // 内容决定列宽度 -> 重新调整jqgrid每列的宽度
    this._resizeColWidth = function () {
        $(this._selector.gbox).append("<td id=\"tdCompute\" style=\"background:#eee;width:auto\"></td>");
        var td=$('#tdCompute') // 获取计算实际列长度的容器
            ,tds // 临时保存列
            ,arr=[]; // 用于保存最大的列宽
        // 遍历每行获得每行中的最大列宽
        $(this._selector.gbox).find('.ui-jqgrid-htable tr,.ui-jqgrid-btable tr:gt(0)').each(function(){
            $(this).find('td,th').each(function(idx){
                arr[idx] = Math.max(arr[idx] ? arr[idx] : 0, td.html($(this).text())[0].offsetWidth);
                arr[idx] = Math.max(arr[idx], 60);
            })
        });
        // 设置页头单元格宽度
        $(this._selector.gbox).find('.ui-jqgrid-labels th').each(function(idx){
            this.style.width = (arr[idx] + 15) + 'px';
        });
        // 设置内容表格中控制单元格宽度的单元格，在第一行
        $(this._selector.gbox).find('.ui-jqgrid-btable tr:eq(0) td').each(function(idx){
            this.style.width = (arr[idx] + 15) + 'px';
        });
        td.remove();
    }
}

BaseTable._ROW_HEIGHT = 42;