if (myApp) {
	myApp.service('DBService', function ($http) {
		this.setData = function (attrs) {
			var res = null;

			//validation & ...

			return res;
		};

		this.getData = function (attrs) {
			var res = null;

			res = (attrs.fieldId) ? db[attrs.fieldId] : false;

			if (attrs.valueId && res[attrs.valueId]) res = res[attrs.valueId];
			//validation & ...

			return res;
		};

		this._get = function (attrs) {
			if (attrs.query instanceof Object) attrs.query = JSON.stringify(attrs.query);

			$http.get('/get/'+ attrs.key + "/" + attrs.query)
			  .success(function (data, status, headers, config) {
			  	if (attrs.callback) {
			  		if (attrs.callbackAttrs) attrs.callback(data, attrs.callbackAttrs);
			  		else attrs.callback(data);
			  	}
			  })
			  .error(function (data, status, headers, config) {
			  	if (attrs.errorCallback) {
			  		if (attrs.errorAttrs) attrs.errorCallback(attrs.errorAttrs);
			  		else attrs.errorCallback();
			  	}
			  });
		};

		this._delete = function (attrs) {
			var query = {
				_id: attrs._id
			};

			query = JSON.stringify(query);

			if (attrs._id) {
				$http.get('/delete/' + attrs.key + "/" + query)
				  .success(function (data, status, headers, config) {
			  		attrs.callback(attrs.key);
				})
				  .error(function (data, status, headers, config) {
			  		console.log("Error: ", data);
				});
			}
		};

		this._set = function (attrs) {
			$http.post('/set/' + attrs.key + "/" + attrs.query, attrs.data)
				.success(function (data, status, headers, config) {
				    console.log("set success");
					attrs.callback();
				})
				.error(function (data, status, headers, config) {
					console.log("Error: ", data);
				});
		};

		this._update = function (attrs) {
			$http({
				method: "POST",
				data: attrs.data,
				url: '/update/' + attrs.key + "/" +  attrs.query,
			})
				.success(function (data, status, headers, config) {
					attrs.callback(attrs.key);
				})
				.error(function (data, status, headers, config) {
					console.log("Error: ", data);
				});
		};
	});
}

var db = {};

db.fields = ["users", "products", "newslist", "aboutus", "group"];