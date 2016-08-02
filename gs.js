/**
 * Created by lizongyuan on 16/7/27.
 * ES6版本gs.js
 */
{
    // 创建G类
    class G {
        constructor (sel) {
            this.e = [];
            if (!sel) {
                console.error('选择对象不能为"", undefined, null!');
                return;
            }
            // 处理this情况
            if (typeof sel === 'object') {
                this.e.push(sel);
                return;
            }
            let nodeList = [...document.querySelectorAll(sel)];
            if (nodeList.length === 0) {
                console.error('选择对象无效:' + sel);
                return;
            }
            for (let value of nodeList) {
                this.e.push(value);
            }
        }

        each (fn) {
            for (let i of this.e) {
                fn.call(this, i);
            }
            return this;
        }

        html (text) {
            if (arguments.length === 0) {
                let args = [];
                this.each(function (e) {
                    args.push(Gs.trim(e.innerHTML));
                });
                /*
                 选择单个对象: 返回值
                 选择多个对象: 返回数组
                 */
                return (args.length === 1 ? args[0] : args);
            } else if (arguments.length === 1) {
                this.each(function (e) {
                    e.innerHTML = text;
                });
            }
        }

        value (val) {
            let tName = this.e[0].tagName;
            if (tName != 'INPUT' && tName != 'TEXTAREA') {
                console.error('选择对象无效: value()方法的有效对象为INPUT、TEXTAREA');
            }
            if (arguments.length === 0) {
                let args = [];
                this.each(function (e) {
                    args.push(e.value);
                });
                return (args.length === 1 ? args[0] : args);
            } else if (arguments.length === 1) {
                this.each(function (e) {
                    e.value = val;
                });
                return this;
            }
        }

        attr (arg) {
            if (typeof arg === 'string') {
                let args = [];
                this.each(function (e) {
                    args.push(e.getAttribute(arg));
                });
                return (args.length === 1 ? args[0] : args);
            } else if (typeof arg === 'object') {
                this.each(function (e) {
                    for (let [key, value] of arg) {
                        e.setAttribute(key, value);
                    }
                })
            } else {
                console.error('参数不合法: attr()方法参数为对象或者字符串');
            }
        }

        find (arg) {
            let curObj = this.e[0];
            let nodeList = [...curObj.querySelectorAll(arg)];
            //清除当前对象已保存的元素
            this.e = [];
            for(let val of nodeList) {
                if (val.tagName !== undefined) {
                    // 需要删除for in 循环遍历的属性方法
                    val.prevObj = curObj;
                    this.e.push(val);
                }
            }
            return this;
        }

        end () {
            let nodeList = [...this.e];
            // 清除当前对象已保存的元素
            this.e = [];
            for (let val of nodeList) {
                if (val.tagName !== undefined) {
                    this.e.push(val.prevObj);
                }
            }
            return this;
        }

        remove (str) {
            this.each(function (e) {
                let nodeList = [...this.e[0].querySelectorAll(str)];
                for (var val of nodeList) {
                    if (val.tagName !== undefined) {
                        e.removeChild(val);
                    }
                }
            });
        }

        append (str) {
            if (typeof str !== 'string') {
                console.error('参数不合法: addChild()方法的参数为字符串');
            }
            this.each(function (e) {
                let node = document.createElement(str);
                e.appendChild(node);
            });
        }

        css (arg) {
            if (typeof arg === 'string') {
                this.each(function (e) {
                    var args = [];
                    //判断兼容性
                    if (e.currentStyle) {
                        args.push(e.currentStyle[arg]);
                    } else {
                        args.push(getComputedStyle(obj,false)[arg]);
                    }
                    return (args.length === 1 ? args[0] : args);
                });
            } else if (typeof arg === 'object') {
                this.each(function (e) {
                    for (var name of Object.keys(arg)) {
                        if (typeof arg[name] === 'number') {
                            e.style[name] = arg[name] + 'px';
                        } else {
                            e.style[name] = arg[name];
                        }
                    }
                });
                return this;
            }
        }

        height (val) {
            if (!val) {
                return this.css('height');
            } else {
                this.css({
                    height: val
                });
                return this;
            }
        }

        width (val) {
            if (!val) {
                return this.css('width');
            } else {
                this.css({
                    width: val
                });
                return this;
            }
        }

        event (en, fn, type = 'a') {
            // 设置默认参数
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
        }

        click (fn) {
            this.event('click', fn);
            return this;
        }

        mouseover (fn) {
            this.event('mouseover', fn);
            return this;
        }

        mouseout (fn) {
            this.event('mouseout', fn);
            return this;
        }

        mousemove (fn) {
            this.event('mousemove', fn);
            return this;
        }

        mousedown (fn) {
            this.event("mousedown", fn);
            return this;
        }

        mouseup (fn) {
            this.event("mouseup", fn);
            return this;
        }

        animate (obj, fn, spd = 20) {
            this.each(function (e) {
                let flag = true;
                clearInterval(e.timer);
                e.timer = setInterval(function () {
                    for(let attr of Object.keys(obj)) {
                        let icur = 0;
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
        }
    }

    window.G = Gs = (sel) => new G(sel);

    // 版本号
    Gs.version = 'es6 1.0';
    // 迭代器
    Gs.each = function (obj, fn) {
        if (obj !== null) {
            let value,
                l = obj.length;
            if (Gs.isArrayLike(obj)) {
                for (let i = 0; i < l; i ++) {
                    // 传入元素下标和元素的值
                    value = fn.call(obj[i], i, obj[i]);
                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (let key of Object.keys(obj)) {
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
    // 判断ArrayLike
    Gs.isArrayLike = (obj) => (obj.length && (typeof obj !== 'string'));
    //判断类型
    Gs.isType = (obj, type) => Object.prototype.toString.call(obj) === '[object' + type + ']';
    // 将Array-like对象转化为数组
    Gs.toArray = (obj) => {Array.from(obj)};
    // 获取元素的属性
    Gs.getStyle = function (obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj,false)[attr];
        }
    };
    // 去除空格
    Gs.trim = (str) => str.replace(/(^\s+)|(\s+$)/g, "");
    // 判断一个字符串是否包含另一个字符串
    Gs.contains = (str, it) => str.includes(it);
    // 回调函数列表对象
    Gs.callback = {
        callbacks: [],
        add (...val) {
            for (let fn of val) {
                this.callbacks.push(fn);
            }
        },
        fire () {
            this.callbacks.forEach(function (fn) {
                fn();
            });
        },
        pop () {
            this.callbacks.pop();
        },
        remove () {
            this.callbacks = [];
        }
    };
    // 加载函数
    Gs.ready = function (func) {
        let oldonload = window.onload;
        if (typeof window.onload !== 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                oldonload();
                func();
            }
        }
    };
    Gs.single = function (fn) {
        let result;
        return function () {
            return result || (result = fn.apply(this, arguments));
        }
    };

    //定义模块机制
    Gs.module = {
        moduleMap: [],
        fileMap: [],
        noop () {},
        // 定义模块
        define (name, dependencies, fn) {
            /*
             name         : 模块名
             dependencies : 模块的依赖项
             fn      : 模块的函数主体
             */
            let moduleMap = this.moduleMap,
                module;
            if (!moduleMap[name]) {
                module = {
                    name: name,
                    dependencies: dependencies,
                    fn: fn
                };
                moduleMap[name] = module;
            }
            return moduleMap[name];

        },
        // 加载模块
        require (pathArr, callback) {
            let fileMap = this.fileMap;
            for (let i = 0; i < pathArr.length; i++) {
                let path = pathArr[i];

                if (!fileMap[path]) {
                    let head = document.getElementsByTagName('head')[0];
                    let script = document.createElement('script');
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
                let allLoaded = true;
                for (let i = 0; i < pathArr.length; i++) {
                    if (!fileMap[pathArr[i]]) {
                        allLoaded = false;
                        break;
                    }
                }
                if (allLoaded) {
                    callback();
                }
            }
        },
        // 使用模块
        use: function (name) {
            let moduleMap = this.moduleMap;
            let noop = this.noop();
            // 存储要使用的模块
            let module = moduleMap[name];

            if (!module.entity) {
                let args = [];
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
        }
    };
}