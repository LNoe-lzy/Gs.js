;(function (window) {
    'use strict';
    /*
     声明全局变量指定接口 'G'
     sel: 用户指定的元素
     */
    var Gs;
    window.G = Gs = function (sel) {
        return new gs(sel)
    };
    // 版本号
    Gs.version = '1.0';

    // 构建gs对象
    var gs = function (sel) {
        // this.e 为当前的获取到的html元素
        this.e = [];

        // 如果输入 '', undefined, null;
        if (!sel) {
            console.error('选择对象不能为"", undefined, null!');
            return;
        }
        // 处理this情况
        if (typeof sel === 'object') {
            this.e.push(sel);
            return;
        }
        var nodeList = document.querySelectorAll(sel);
        if (nodeList.length === 0) {
            console.error('选择对象无效:' + sel);
            return;
        }
        // for (var i = 0, l = nodeList.length; i < l; i++) {
        //     this.e.push(nodeList[i]);
        // }
        for (var i = 0, node; node = nodeList[i++];) {
            this.e.push(node);
        }

        return this;
    };

    gs.prototype = {
        // 每一个gs对象添加方法
        each: function (fn) {
            for (var i in this.e) {
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
                var a = [];
                this.each(function (e) {
                    a.push(Gs.trim(e.innerHTML));
                });
                /*
                 选择单个对象: 返回值
                 选择多个对象: 返回数组
                 */
                return (a.length === 1 ? a[0] : a);
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
        val: function (val) {
            var tName = this.e[0].tagName;
            if (tName != 'INPUT' && tName != 'TEXTAREA') {
                console.error('选择对象无效: value()方法的有效对象为INPUT、TEXTAREA');
            }
            if (arguments.length === 0) {
                var a = [];
                this.each(function (e) {
                    a.push(e.value);
                });
                return (a.length === 1 ? a[0] : a);
            } else if (arguments.length === 1) {
                this.each(function (e) {
                    e.value = val;
                });
                return this;
            }
        },
        /*
         参数为字符串: 获取元素属性
         参数为对象  : 为元素设置属性值
         */
        attr: function (arg) {
            if (typeof arg === 'string') {
                var a = [];
                this.each(function (e) {
                    a.push(e.getAttribute(arg));
                });
                return (a.length === 1 ? a[0] : a);
            } else if (typeof arg === 'object') {
                this.each(function (e) {
                    for (var name in arg) {
                        e.setAttribute(name, arg[name]);
                    }
                })
            } else {
                console.error('参数不合法: attr()方法参数为对象或者字符串');
            }
        },
        // 查找指定元素下的子元素
        find: function (arg) {
            var curObj = this.e[0];
            var nodeList = curObj.querySelectorAll(arg);
            //清除当前对象已保存的元素
            this.e = [];
            for (var i = 0, l = nodeList.length; i < l; i++) {
                nodeList[i].prevObj = curObj;
                this.e.push(nodeList[i]);
            }
            return this;
        },
        // 返回当前作用域链的上一个对象
        end: function () {
            var nodeList = this.e;
            // 清除当前对象已保存的元素
            this.e = [];
            for (var i in nodeList) {
                if (nodeList[i].tagName !== undefined) {
                    this.e.push(nodeList[i].prevObj);
                }
            }
            return this;

        },
        // 删除指定元素及其所有子元素
        remove: function (str) {
            this.each(function (e) {
                var nodeList = this.e[0].querySelectorAll(str);
                for (var i = 0, l = nodeList.length; i < l; i++) {
                    e.removeChild(nodeList[i]);
                }
            });
        },
        // 为指定元素添加子元素
        append: function (str) {
            if (typeof str !== 'string') {
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
            if (typeof arg === 'string') {
                var a = [];
                this.each(function (e) {
                    //判断兼容性
                    if (e.currentStyle) {
                        a.push(e.currentStyle[arg]);
                    } else {
                        a.push(getComputedStyle(e,false)[arg]);
                    }
                });
                return (a.length === 1 ? a[0] : a);
            } else if (typeof arg === 'object') {
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
        event: function (en, fn, type) {
            // 设置默认参数
            type = 'a' || type;
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
            this.event('click', fn);
            return this;
        },
        mouseover: function (fn) {
            this.event('mouseover', fn);
            return this;
        },
        mouseout: function (fn) {
            this.event('mouseout', fn);
            return this;
        },
        mousemove: function (fn) {
            this.event('mousemove', fn);
            return this;
        },
        mousedown: function (fn) {
            this.event("mousedown", fn);
            return this;
        },

        mouseup: function (fn) {
            this.event("mouseup", fn);
            return this;
        },
        /*
         添加动画处理函数
         */
        animate: function (obj, fn, spd) {
            this.each(function (e) {
                clearInterval(e.timer);
                e.timer = setInterval(function () {
                    var flag = true;
                    for(var attr in obj) {
                        var icur = 0;
                        if (attr === 'opacity') {
                            icur = Math.round(parseFloat(Gs.getStyle(e, attr)) * 100);
                        } else {
                            icur = parseInt(Gs.getStyle(e, attr));
                        }
                        var speed = 0;
                        speed = (obj[attr] - icur)/10;
                        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                        if (icur !== obj[attr]) {
                            flag = false;
                        }
                        if (attr === 'opacity') {
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
                }, spd || 10);
            });
            return this;
        },
        fadeIn: function (speed, opacity) {
            speed = speed || 10;
            opacity = opacity || 100;
            this.each(function (e) {
                // 显示元素,并将元素值为0透明度(不可见)
                e.style.display = 'block';
                Gs.setOpacity(e, 0);
                //初始化透明度变化值为0
                var val = 0;
                // 循环将透明值以5递增,即淡入效果
                (function fn() {
                    Gs.setOpacity(e, val);
                    val += 5;
                    if (val <= opacity) {
                        setTimeout(fn, speed)
                    }
                })();
            });
            return this;
        },
        fadeOut: function (speed, opacity) {
            speed = speed || 10;
            opacity = opacity || 0;
            this.each(function (e) {
                // 初始化透明度变化值为0
                var val = 100;
                // 循环将透明值以5递减,即淡出效果
                (function fn() {
                    Gs.setOpacity(e, val);
                    val -= 5;
                    if (val >= opacity) {
                        setTimeout(fn, speed);
                    } else if (val < 0) {
                        // 元素透明度为0后隐藏元素
                        e.style.display = 'none';
                    }
                })();
            });
            return this;
        }
    };

    /*
     全局控制函数
     */
    // 迭代器方法
    Gs.each = function (obj, fn) {
        if (obj !== null) {
            var value,
                l = obj.length;
            if (Gs.isArrayLike(obj)) {
                for (var i = 0; i < l; i ++) {
                    // 传入元素下标和元素的值
                    value = fn.call(obj[i], i, obj[i]);
                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (var key in obj) {
                    value = fn.call(obj[key], key, obj[key]);
                    if (value === false) {
                        break;
                    }
                }
            }
        }
    };
    // 判断是否为NaN
    Gs.isNaN = function (obj) {
        return obj !== obj;
    };
    // 判断是否为undefine
    Gs.isUndefined = function (obj) {
        return obj === void 0;
    };
    // 判断是否为null
    Gs.isNull = function (obj) {
        return obj === null;
    };
    // 判断是否为Arraylike
    Gs.isArrayLike = function (obj) {
       return (obj.length && (typeof obj !== 'string'));
    };
    // 判断类型
    Gs.isType = function (obj, type) {
        return Object.prototype.toString.call(obj) === '[object' + type + ']';
    };
    // 将Array-like对象转化为数组
    Gs.toArray = function (obj) {
        var a = [];
        if (obj !== null) {
            if (!Gs.isArrayLike(obj)) {
                a[0] = obj;
            } else {
                while (l) {
                    a[--l] = obj[l];
                }
            }
        }
        return a;
    };
    // 获取元素的属性
    Gs.getStyle = function (obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj,false)[attr];
        }
    };
    // 设置元素的透明度
    Gs.setOpacity = function (obj, o) {
        obj.filters ? obj.style.filter = 'alpha(opacity=' + o + ')' : obj.style.opacity = o / 100;
    };
    // 去除空格
    Gs.trim = function (str) {
        return str.replace(/(^\s+)|(\s+$)/g, "")
    };
    // 判断一个字符串是否包含另一个字符串
    Gs.contains = function (str, it) {
        return str.indexOf(it) !== -1;
    };
    // 加载函数
    Gs.ready = function (func) {
        var oldonload = window.onload;
        if (typeof window.onload !== 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                oldonload();
                func();
            }
        }
    };
    /*
      ajax
      data = {
         type: GET / POST,
         url: '',
         data: {},
         async: true / false
         success: function () {},
         error: function () {]
      }
     */
    Gs.ajax = function (data) {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpReques();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.open(data.type, data.url, data.async);
        xhr.onreadystatechange = function () {

        }
    };

    // 回调函数列表对象
    Gs.callback = (function () {
        var callback = [];
        var add = function () {
           for (var fn in arguments) {
               callback.push(arguments[fn]);
           }
        };
        var fire = function () {
            callback.forEach(function (fn) {
                fn();
            });
        };
        var pop = function () {
           callback.pop();
        };
        var remove = function () {
           callback = [];
        };
        return {
            add: add,
            fire: fire,
            pop: pop,
            remove: remove
        };
    })();
    // 定义函数扩展机制
    Gs.fn = (function () {
        /*
          单例模式
          方法:
              var a = function () {};
              var b = Gs.single(a);
              b();
         */
        var single = function (fn) {
            var result;
            return function () {
                return result || (result = fn.apply(this, arguments));
            }
        };
        /*
          装饰模式
          方法:
              var a = function () {};
              a = Gs.before(a, function(){});
              a();
         */
        var before = function (fn, before) {
            return function () {
                before.apply(this, arguments);
                return fn.apply(this, arguments);
            }
        };
        var after = function (fn, after) {
            return function () {
                var ret = fn.apply(this, arguments);
                after.apply(this, arguments);
                return ret;
            }
        };
        return {
            single: single,
            before: before,
            after: after
        }
    })();
    // 定义模块机制
    Gs.module = (function () {
        var moduleMap = [],
            fileMap = [],
            noop = function () {};
        var define = function (name, dependencies, fn) {
            /*
             name         : 模块名
             dependencies : 模块的依赖项
             fn      : 模块的函数主体
             */
            var module;
            if (!moduleMap[name]) {
                module = {
                    name: name,
                    dependencies: dependencies,
                    fn: fn
                };
                moduleMap[name] = module;
            }
            return moduleMap[name];

        };
        // 加载模块
        var require = function (pathArr, callback) {
            for (var i = 0; i < pathArr.length; i++) {
                var path = pathArr[i];

                if (!fileMap[path]) {
                    var head = document.getElementsByTagName('head')[0];
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = 'true';
                    script.src = './modules/' + path + '.js';
                    script.onload = function () {
                        fileMap[path] = true;
                        head.removeChild(script);
                        checkAllFiles();
                    };
                    head.appendChild(script);
                }
            }

            function checkAllFiles () {
                var allLoaded = true;
                for (var i = 0; i < pathArr.length; i++) {
                    if (!fileMap[pathArr[i]]) {
                        allLoaded = false;
                        break;
                    }
                }
                if (allLoaded) {
                    callback();
                }
            }
        };
        // 使用模块
        var use = function (name) {
            // 存储要使用的模块
            var module = moduleMap[name];

            if (!module.entity) {
                var args = [];
                // 找到要依赖的模块
                for (var i = 0; i < module.dependencies.length; i++) {
                    if (moduleMap[module.dependencies[i]].entity) {
                        args.push(moduleMap[module.dependencies[i]].entity);
                    } else {
                        args.push(this.use(module.dependencies[i]));
                    }
                }
                module.entity = module.fn.apply(noop, args);
            }
            return module.entity;
        };
        return {
            require: require,
            use: use,
            define: define
        };
    })();
})(window);

