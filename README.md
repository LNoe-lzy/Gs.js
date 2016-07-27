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
