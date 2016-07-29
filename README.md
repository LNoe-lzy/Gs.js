# Gs.js
## 使用方法
*** 
在html文件中引入gs库文件：	
`<script type='text/javascript' src='gs.js'></src>`

## 内置方法
***
* G(''): 选择元素；	
`G('div')`
* each: 未选择的所有对象添加方法；		
`G('input').each(function(){});`
* html: 对选择的对象的html进行修改或者获取；		
`G('div').html();`
* value: 对input、textarea元素的value进行修改或者获取;		
`G('input').value();`
* attr: 对选取对象的属性进行获取或者修改；				
`G('div').attr();`
* find: 查找指定对象的子元素;				
`G('div').find('p');`
* end: 返回当前作用域链的上一个对象；		
`G('div').find('p').end();`
* remove: 删除指定元素及其所有子元素；			
`G('div').remove();`
* append: 为指定元素添加子元素;	
`G('div).append('div');`
* css: 对指定元素的样式进行获取或者修改操作；	
`G('div').css();`
* height: 设置或获取元素的高；	
`G('div').height();`
* width: 设置或获取元素的宽;	
`G('div').width();`
* event: 未指定对象添加或删除事件；		
`G('div').event('click', function(){},'a');`
* click: 添加click事件；	
`G('div').click();`
* mouseover: 添加mouseover事件；	
`G('div').mouseover();`
* mouseout: 添加mouseout事件；		
`G('div').mouseout();`
* mousemove: 添加mousemove事件；		
`G('div').mousemove();`
* mousedown:添加mousedown事件；		
`G('div').mousedown();`
* mouseup:添加mouseup事件；	
`G('div').mouseup();`
* animate: 未指定的元素添加动画过渡效果；			
`G('div').animate({'width': '100'});`
* Gs.isNaN: 判断指定的对象是否为NaN；	
`G.isNaN(obj);`
* Gs.isUndefined: 判断指定对象是否为undefined;	
`G.isUndefined(obj);`
* Gs.isNull: 判断指定对象是否为NuLL;		
`G.isNull(obj);`
* Gs.toArray(obj): 将指定的类数组对象转换为数组;	
`G.toArray(obj);`
* Gs.getStyle: 获取指定元素的指定属性; 		
`G.getStyle(obj, 'width');`
* Gs.trim: 去除字符串的多余的空格;		
`G.trim(str);`
* Gs.contains: 判断字符串中是否包含另一字符串		
`G.contains('hello world', 'hello');`
* Gs.callback.add: 添加指定函数到函数队列;		
`G.callback.add(fn);`
* Gs.callback.fire: 执行函数队列的函数;		
`G.callback.fire();`
* Gs.ready: 缓存加载函数;		
`G.ready(fn);`
* Gs.module.define: 定义模块;		
`G.module.define('name', [dependencies], fn);`
* Gs.module.use: 使用模块; 		
`G.module.use(modulename);`
* Gs.module.require: 加载模块;		
`G.module.require('module', fn);`
* Gs.single: 单例模式;      
`var a = function () {}; var b = Gs.single(a); b();`
