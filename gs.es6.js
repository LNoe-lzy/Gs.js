/**
 * Created by lizongyuan on 16/7/27.
 * ES6版本gs.js
 */

;((window) => {
    window.G = Gs = (sel) => new gs(sel);
    // 版本号
    Gs.version = 'es6 1.0';
    // 创建gs类
    let gs = function (sel) {
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
        let nodeList = [...document.querySelectorAll(sel)];
        if (nodeList.length === 0) {
            console.error('选择对象无效:' + sel);
            return;
        }

        for (let value of nodeList) {
            this.e.push(value);
        }

        return this;
    };

    gs.prototype = {
        each (fn) {
            for (let i of this.e) {
                fn.call(this, i);
            }
            return this;
        },
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
                if (args.length === 1) {
                    return args[0];
                } else {
                    return args;
                }
            } else if (arguments.length === 1) {
                this.each(function (e) {
                    e.innerHTML = text;
                });
            }
        },
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
                if (args.length === 1) {
                    return args[0];
                } else {
                    return args;
                }
            } else if (arguments.length === 1) {
                this.each(function (e) {
                    e.value = val;
                });
                return this;
            }
        },
    };


    Gs.trim = (str) => str.replace(/(^\s+)|(\s+$)/g, "");

})(window);