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
       全局ajax接口
     */
    window.Gxhr = Gsxhr = function () {
       return new gsxhr();
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
                return Gs.trim(this.e[0].innerHTML);
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
        },
        /*
           参数为字符串: 返回指定样式的值
           参数为对象  :为指定的元素添加样式
         */
        css: function (arg) {
            if (typeof arg == 'string') {
                // return this.e[0].style[arg];
                var obj = this.e[0];
                //判断兼容性
                if (obj.currentStyle) {
                    //去除'px'
                    return parseFloat(obj.currentStyle[arg]);
                } else {
                    //去除'px'
                    return parseFloat(getComputedStyle(obj,false)[arg]);
                }
            } else if (typeof arg == 'object') {
                this.each(function (e) {
                    for (var name in arg) {
                        if (typeof arg[name] === 'number') {
                            e.style[name] = arg[name] + 'px';
                        } else {
                            e.style[name] = arg[name];
                        }
                    }
                });
                return this;
            }
        },
        /*
           参数为空: 获取元素的高度;
           参数不空: 设置元素的高度;
         */
        height: function (val) {
            if (!val) {
                return this.css('height');
            } else {
                this.css({
                    height: val
                });
                return this;
            }
        },
        /*
         参数为空: 获取元素的宽度;
         参数不空: 设置元素的宽度;
         */
        width: function (val) {
            if (!val) {
                return this.css('width');
            } else {
                this.css({
                    width: val
                });
                return this;
            }
        },
        /*
           第三个参数用户判断给指定元素添加/删除事件
           a: 添加指定事件
           r: 删除指定事件
         */
        event: function(en, type, fn) {
            switch (type) {
                case 'a':
                    document.addEventListener ? this.each(function(eles) {
                        eles.addEventListener(en, fn, false);
                    }) : this.each(function(eles) {
                        eles.attachEvent("on" + en, fn);
                    });
                    break;
                case 'r':
                    document.removeEventListener ? this.each(function(eles) {
                        eles.removeEventListener(en, fn, false);
                    }) : this.each(function(eles) {
                        eles.detachEvent("on" + en, fn);
                    });
                    break;
            }
            return this;
        },
        click: function (fn) {
            this.event('click', 'a', fn);
            return this;
        },
        mouseover: function (fn) {
            this.event('mouseover', 'a', fn);
            return this;
        },
        mouseout: function (fn) {
            this.event('mouseout', 'a', fn);
            return this;
        },
        mousemove: function (fn) {
            this.event('mousemove', 'a', fn);
            return this;
        },
        mousedown: function(fn) {
            this.event("mousedown", 'a', fn);
            return this;
        },

        mouseup: function(fn) {
            this.event("mouseup", 'a', fn);
            return this;
        },
        /*
           添加动画处理函数
         */
        animate: function (obj, spd, fn) {
            if (!spd) {
                spd = 20;
            }
            this.each(function (e) {
                var flag = true;
                clearInterval(e.timer);
                e.timer = setInterval(function () {
                    for(var attr in obj) {
                        var icur = 0;
                        if (attr == 'opacity') {
                            icur = Math.round(parseFloat(Gs.getStyle(e, attr)) * 100);
                        } else {
                            icur = parseInt(Gs.getStyle(e, attr));
                        }
                        var speed = 0;
                        speed = (obj[attr] - icur)/10;
                        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                        if (icur != obj[attr]) {
                            flag = false;
                        }
                        if (attr == 'opacity') {
                            e.style[attr] = (icur + speed) / 100;
                        } else {
                            e.style[attr] = icur + speed + "px";
                        }
                    }
                    if (flag) {
                        clearInterval(e.timer);
                        if (fn) {
                            fn();
                        }
                    }
                }, spd);
            });
            return this;
        },

    };

    //构建ajax对象
    var gsxhr = function () {
       if (window.XMLHttpRequest) {
           return new XMLHttpRequest();
       } else {
           return new ActiveXObject("Microsoft.XMLHTTP");
       }
    };
    /*
       全局控制函数
     */

    //获取元素的属性
    Gs.getStyle = function (obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj,false)[attr];
        }
    };
    //去除空格
    Gs.trim = function (str) {
        return str.replace(/(^\s+)|(\s+$)/g, "")
    };
    //ajax
    Gs.ajsx = function (data) {
        var type = {
            xml: "application/xml, text/xml",
            html: "text/html",
            script: "text/javascript, application/javascript",
            json: "application/json, text/javascript",
            text: "text/plain",
            _default: "*/*"
        };
        var xhr = new gsxhr();

        data.method = data.method.toUpperCase() || "GET";
        data.datatype = data.datatype || "json";
        data.asyn = data.asyn || true;

        if (xhr) {
            xhr.open(data.method, data.url, data.asyn);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Accept", data.datatype && type[data.datatype] ? type[data.datatype] + ", */*" : type._default);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 1) {
                    data.loading(xhr.response);
                } else {
                    if (xhr.readyState == 2) {
                        data.loaded(xhr.response);
                    } else {
                        if (xhr.readyState == 3) {
                            data.interactive(xhr.response);
                        } else {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 200) {
                                    Gs.dataform(xhr, data.datatype);
                                    data.success(xhr.response);
                                    return xhr;
                                } else {
                                }
                            }
                        }
                    }
                }
            };
            try {
                xhr.send(data.method === "POST" ? Gs.serialize(data.senddata) : null)
            } catch (j) {
                data.fail(xhr.response);
            }
        }
    };

    Gs.dataform = function (g, e) {
        var d = g.getResponseHeader("content-type") || "",
            c = e === "xml" || !e && d.indexOf("xml") >= 0,
            f = c ? g.responseXML : g.responseText;
        if (typeof f === "string") {
            if (e === "json" || !e && d.indexOf("json") >= 0) {
                // f = Oct.trim(f);
                return window.JSON && window.JSON.parse ? window.JSON.parse(f) : (new Function("return " + f))()
            }
        }
        return f
    };

    Gs.serialize = function (data) {
        var key = [], val = [], pair = [], str = "";
        for (var name in data) {
            key.push(encodeURIComponent(name));
            val.push(encodeURIComponent(data[name]));
        }
        for (var i = 0; i < key.length; i++) {
            pair[i] = key[i] + "=" + val[i];
        }
        return str = pair.join("&");
    };

})(window);
