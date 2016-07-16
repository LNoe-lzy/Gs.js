/**
 * Created by lizongyuan on 16/7/14.
 */
;(function (window) {
    /*
       声明全局变量指定接口 'G'
       sel: 用户指定的元素
     */
    window.G = Gs = function (sel) {
        return new gs(sel)
    };
    /*
       定义版本号
     */
    Gs.version = '1.0';
    //构建gs对象
    var gs = function (sel) {
        //this.e 为当前的获取到的html元素
        this.e = [];

        //如果输入 '', undefined, null;
        if (!sel) {
            console.error('选择对象不能为"", undefined, null!');
            return;
        }
        //处理this情况
        if (typeof sel == 'object') {
            this.e.push(sel);
            return;
        }
        var nodeList = document.querySelectorAll(sel);
        if (nodeList.length === 0) {
            console.error('选择对象无效:' + sel);
            return;
        }
        for(var i in nodeList) {
            if (nodeList[i].tagName !== undefined) {
                //需要删除for in 循环遍历的属性方法
                this.e.push(nodeList[i]);
            }
        }

        return this;
    };

    gs.prototype = {
        //每一个gs对象添加方法
        each: function (fn) {
            for (i in this.e) {
                fn.call(this, this.e[i]);
            }
            return this;
        },
        /*
           参数为空: 获取当前元素的标签内的内的值
           参数不空: 为当前的元素添加/替换内容
         */
        html: function (text) {
            if (arguments.length === 0) {
                //去除多余的空格
                return this.e[0].innerHTML.replace(/(^\s+)|(\s+$)/g, "");
            } else if (arguments.length === 1) {
                this.each(function (e) {
                    e.innerHTML = text;
                });
            }
        },
        /*
           参数为空: 获取元素的值
           参数不空: 为元素设置value值
         */
        value: function (val) {
            var tName = this.e[0].tagName;
            if (tName != 'INPUT' && tName != 'TEXTAREA') {
                console.error('选择对象无效: value()方法的有效对象为INPUT、TEXTAREA');
            }
            if (arguments.length === 0) {
                return this.e[0].value;
            } else if (arguments.length === 1) {
                this.each(function (e) {
                    e.value = val;
                });
            }
        },
        /*
           参数为字符串: 获取元素属性
           参数为对象  : 为元素设置属性值
         */
        attr: function (arg) {
           if (typeof arg == 'string') {
               return this.e[0].getAttribute(arg);
           } else if (typeof arg == 'object') {
               this.each(function (e) {
                   for (var name in arg) {
                       e.setAttribute(name, arg[name]);
                   }
               })
           } else {
               console.error('参数不合法: attr()方法参数为对象或者字符串');
           }
        },
        //查找指定元素下的子元素
        find: function (arg) {
            var nodeList = this.e[0].querySelectorAll(arg);
            //清除当前对象已保存的元素
            this.e = [];
            for(var i in nodeList) {
                if (nodeList[i].tagName !== undefined) {
                    //需要删除for in 循环遍历的属性方法
                    this.e.push(nodeList[i]);
                }
            }
            return this;
        },
        //删除指定元素及其所有子元素
        remove: function (str) {
            this.each(function (e) {
                var nodeList = this.e[0].querySelectorAll(str);
                for (var i in nodeList) {
                    if (nodeList[i].tagName !== undefined) {
                        e.removeChild(nodeList[i]);
                    }
                }
            });
        },
        //为指定元素添加子元素
        append: function (str) {
            if (typeof str != 'string') {
                console.error('参数不合法: addChild()方法的参数为字符串');
            }
            this.each(function (e) {
                var node = document.createElement(str);
                e.appendChild(node);
            });
        }
    }

})(window);