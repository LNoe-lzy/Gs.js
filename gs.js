/**
 * Created by lizongyuan on 16/7/14.
 */
;(function (window) {
    /*
       声明全局变量指定接口 'G'

       target: 用户指定的元素
     */
    window.G = Gs = function (sel) {
        return new gs(sel)
    };

    /*
       定义版本号
     */

    Gs.version = '1.0';

    var gs = function (sel) {
        /*
           type : 存储选择器的类型
           tmp  : 存储选择符后的选择字符串
           selExp: 存储正则规则
         */

        this.e = [];

        //如果输入 '', undefined, null;
        if (!sel) {
            console.error('选择对象不能为"", undefined, null!');
            return;
        }

        if (typeof sel == 'object') {
            this.e.push(sel);
            return;
        }

        var nodeList = document.querySelectorAll(sel);
        if (nodeList.length === 0) {
            console.error('选择器无效:' + sel);
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


    }

})(window);