var Tool = (function() {
	var Tool = function() {};
	Tool.prototype = {
		constructor: Tool,
		//数组去重（ES5）
		unique: function (arr) {
			return arr.filter(function(ele, index, array) {
				console.log(array.indexOf(ele)+"---"+index);
				return array.indexOf(ele) === index
			})
		},
		//将json数组循环成字符串（ES5）
		getStr: function (arr, appoint_proto_) {
			var that = this;
			return arr.reduce(function(pre, next) {
				if(next.hasOwnProperty(appoint_proto_)) {
					pre += next.text + ":" + next.value + ",";
					return pre + that.getStr(next[appoint_proto_], appoint_proto_);
				}
				return pre + next.text + ":" + next.value + ",";
			}, '')
		},
		//数据库操作 "ora_idb4" database_name obj_name main_key _index
		dbOperator: function(config, callback) {
			var db;
			var isFirstAccess = false;//是否是第一次创建
			var callback = callback || function() {};
			var status = "indexedDB" in window && !/iPad|iPhone|iPod/.test(navigator.platform);
			if(!status) {
				alert("当前设备不支持");
				return;
			}
			var openRequest = indexedDB.open(config.database_name, 1);
			openRequest.onupgradeneeded = function(e) {
				var thisDB = e.target.result;
				console.log("首次打开数据库或者版本号进行变更");
				if(!thisDB.objectStoreNames.contains(config.obj_name)) {
					console.log("创建一个firstOS新的对象");
					var peopeOS = thisDB.createObjectStore(config.obj_name, {keyPath: config.main_key});
					peopeOS.createIndex(config._index, config._index, {unique:false});
				}
				isFirstAccess = true;
			}
			openRequest.onsuccess = function(e) {
				console.log("成功打开数据库");
				db = e.target.result;
				console.dir(db.objectStoreNames);
				//业务逻辑操作
				callback(db, isFirstAccess);
			}
			openRequest.onerror = function(e) {
				console.log("打开数据库失败");
				console.dir(e);
			}
		}
	}
	return Tool;
})()