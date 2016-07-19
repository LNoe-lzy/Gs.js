;(function () {
	/* 
	  modeuleMap: 存储创建的模块
	  fileMap   : 存储文件的加载状态
	  noop      : 空函数
	*/
	var moduleMap = {};
	var fileMap = {};
	var noop = function () {};
	
	var Gsframe = {
		define: function (name, dependencies, fn) {
			/* 
	           name         : 模块名
	           dependencies : 模块的依赖项
	           fn      : 模块的函数主体 
	        */
			if (!moduleMap[name]) {
				var module = {
					name: name,
					dependencies: dependencies,
					fn: fn
				};
				moduleMap[name] = module;
			}
			return moduleMap[name];
		},
		use: function (name) {
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
		},
		require: function (pathArr, callback) {
			for (var i = 0; i < pathArr.length; i++) {
				var path = pathArr[i];

				if (!fileMap[path]) {
					var head = document.getElementsByTagName('head')[0];
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.async = 'true';
					script.src = './modules/' + path + '.js';
					script.onload = function (argument) {
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
		}
	};
	//注册全局变量
	window.Gsframe = Gsframe;
})();