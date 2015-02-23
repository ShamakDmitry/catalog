if (myApp) {
	myApp.controller('Admin', function ($scope, $http, $location, $timeout, $rootScope, DBService) {
		$scope.user = {
			logged: false
		};

		$scope.selectedBase = null;

		$scope.editMode = false;

		$scope.sidebarList = null;
		$scope.dataList = [];

		$scope.accessParams = null;
		$scope.lastSelectedItemParams = null;
		$scope.selectedItem = null;

		$scope.getTemplate = function (id, data) {
			var template = null;

			data = (data) ? data : {};

			switch (id) {
				case "users":
					template = new User(data);
					break;
				case "products":
					template = new Product(data);
					break;
				case "aboutus":
					template = new Contact(data);
					break;
				case "group":
					template = new Group(data);
					break;
				case "newslist":
					template = new News(data);
					break;
				case "order":
					template = new Order(data);
					break;
			}

			return template;
		};

		$scope.clearAccessParams = function () {
			$scope.accessParams = {
				canOpen: false,
				canEdit: false,
				canAddUser: false
			};
		};

		$scope.updateAccessIcons = function () {
			var access = [];

			if ($scope.accessParams.canOpen) access.push("open");
			if ($scope.accessParams.canEdit) access.push("edit");
			if ($scope.accessParams.canAddUser) access.push("adduser");


			$scope.user.access = access;
			$scope.update();
		};

		$scope.getAccessRange = function () {
			$scope.clearAccessParams();
			var group = $scope.user.group;

			switch (group) {
				case "admin":
					$scope.accessParams.canOpen = true;
					$scope.accessParams.canEdit = true;
					$scope.accessParams.canAddUser = true;
					break;
				case "operator":
					$scope.accessParams.canOpen = true;
					break;
			}

			$scope.updateAccessIcons(group);
		};

		$scope.checkActionAccess = function (action) {
			var res = false;
			if ($scope.accessParams) {
				//change to get access from DB
				switch(action) {
					case "open":
						if ($scope.accessParams.canOpen) res = true;
						break;
					case "edit":
						if ($scope.accessParams.canEdit) res = true;
						break;
					case "adduser":
						if ($scope.accessParams.canAddUser) res = true;
						break;
				}
			} else {
				$scope.getAccessRange();
				$scope.checkActionAccess(action);
			}

			return res;
		};

		$scope.clearSelections = function () {
			$scope.dataList = [];
			$scope.lastSelectedItemParams = null;
			$scope.selectedItem = null;

			$scope.update();
		};

		$scope.initData = function (data) {
			if (data instanceof Object) $scope.dataList = data;
			else $scope.dataList = [];

			$scope.update();
		};

		$scope.getDataList = function (id) { //get only id & title of items
			if ($scope.checkActionAccess("open")) {
				id = (id) ? id : $scope.selectedBase;

				$scope.clearSelections();
				$scope.selectedBase = id;

				DBService._get({
					key: id,
					query: "",

					callback: $scope.initData
				});
			}
		};

		$scope.checkForJson = function (data) {
			var res;
			try {
				res = JSON.parse(data);
			} catch (err) {
				res = {};
			}

			return res;
		};
		
		$scope.selectDataItem = function (obj, ind) { //get all data by id
			obj = (obj) ? obj : $scope.selectedItem;
			ind = ((typeof ind == "number") && (ind != null) && (ind != undefined)) ? ind : $scope.lastSelectedItemParams.ind;

			var base = $scope.selectedBase;

			if ($scope.checkActionAccess("open")) {
				obj = $scope.checkForJson(obj);
				if ($scope.lastSelectedItemParams) $scope.closeSelectedItem();

				if (obj instanceof Object) $scope.lastSelectedItemParams = {
					id: obj._id,
					ind: ind
				};

				$scope.selectedItem = $scope.removeSecureFields(base, $scope.getTemplate(base, $scope.dataList[ind]));

				if (base == "order") {
					$scope.selectedItem.order = $scope.selectedItem.order.split("@");
					$scope.$$childHead.getOrders();
				}

				$scope.toggleEditMode(false);
				$scope.update();
			}
			
		};

		$scope.addNewItem = function (id) {
			if($scope.checkActionAccess("edit")) {
				var template = $scope.getTemplate(id);

				DBService._set({
					key: id,
					query: "",
					data: template,
					callback: $scope.getDataList
				});
			}
			$scope.update();
		};

		$scope.unselectDataListItem = function () {
			angular.element('#data-list li.active').removeClass("active");
			$scope.toggleEditMode(false);
		};

		$scope.unselectSidebarItem = function () {
			angular.element('#sidebar li.active').removeClass("active");
		};

		$scope.closeSelectedItem = function () {
			$scope.selectedItem = null;
			$scope.toggleEditMode(false);
			$scope.update();
		};

		$scope.toggleEditMode = function (isActive) {
			if ($scope.checkActionAccess("edit")) {
				$scope.editMode = isActive;
			}

			$scope.update();
		};

		$scope.cancelEdit = function () {
			//return data
			$scope.closeSelectedItem();
			$scope.selectDataItem($scope.lastSelectedItemParams.id, $scope.lastSelectedItemParams.ind);
			$scope.toggleEditMode(false);
		};

		$scope.validateBeforeAction = function (attrs) {
			attrs.key = (attrs.key) ? attrs.key : $scope.selectedBase;

			var editdItem = $scope.getEditData();

			var basicQuery = {
				_id: $scope.lastSelectedItemParams.id
			};

			attrs.query = (attrs.query) ? attrs.query : JSON.stringify(basicQuery);

			DBService._get({
				key: attrs.key,
				query: attrs.query,

				callback: function (data) {
					//console.log("validateBeforeAction", attrs.key, attrs.query, data);

					var callCallback = true;

					if (callCallback) attrs.callback();
					else {
						attrs.error = (attrs.error) ? attrs.error : "Была допущена ошибка, проверьте введенные данные";
						alert(attrs.error);
					}
				},
				callbackAttrs: attrs.callbackAttrs,
				errorCallback: attrs.errorCallback,
				errorCallbackAttrs: attrs.errorCallbackAttrs
			});
		};

		$scope.removeSecureFields = function (base, data) {
			var res = null,
				secureBases = {
					users: true
				};

			if (secureBases[base]) {
				res = {};
				data.password = null;

				for (var key in data) {
					if (data[key]) {
						res[key] = data[key];
					}
				}
			}

			return (res) ? res : data;
		};

		$scope.formateForUpdate = function (base, data) {
			//find what data was changed
			var res = {},
				customValue = ["empty field"];

			data = $scope.removeSecureFields(base, data);

			var tmplt = $scope.getTemplate(base, data);

			for(var key in tmplt) {
				if (tmplt[key] && !(customValue.indexOf(tmplt[key])+1)) {
					res[key] = tmplt[key];
				}
			}

			return res;
		};

		$scope.getEditData = function () {
			var data = {};

			$('#edit-fields-container input').each(function (elem) {
				data[$(this).attr("item-type")] = $(this)[0].value;
			});

			data = $scope.formateForUpdate($scope.selectedBase, data);

			return data;
		};

		$scope.saveEdit = function () {
			var data = $scope.getEditData();

			//save edit data
			if (data && $scope.checkActionAccess("edit")) {
				DBService._update({
					key: $scope.selectedBase,
					query: JSON.stringify({
						_id: $scope.lastSelectedItemParams.id
					}),
					data: data,

					callback: function () {
						switch($scope.selectedBase) {
							case "order":
								$rootScope.$broadcast("orderData");
								break;
							default:
								$scope.getDataList(false);
								break;
						}
					}
				});

				$scope.toggleEditMode(false);
			}
		};


		$scope.deleteItem = function () {
			//delete selected item
			if ($scope.checkActionAccess("edit")) {
				DBService._delete({
					key: $scope.selectedBase,
					_id: $scope.lastSelectedItemParams.id,

					callback: $scope.getDataList
				});

				$scope.closeSelectedItem();
			}
		};

		$scope.changeLocation = function (path) {
			if ($scope.user.logged) {
				switch ($scope.user.group) {
					case "operator":
						path = "/order";
						break;
					case "admin":
						path = path;
						break;
					default:
						path = "/";
						break;
				};
			}

			console.log($scope.user.group, path);

			$location.path(path);

			$scope.update();
		};

		$scope.redirectToView = function (path) {
			if (path) {
				path = path;
			} else if ($location.path() == "/registration") {
				page = "/registration";
			} else if($scope.user.logged) {
				if($location.path() == "/order") {
					path = "/order";
				} else path = "/logged";
			} else if(!$scope.user.logged) {
				path = "/";
			}

			$scope.changeLocation(path);
		};

		$scope.logout = function () {
			$scope.user.logged = false;
			localStorage.removeItem("user");
			$scope.redirectToView();
		};

		$scope.getUser = function (attrs) {
			attrs.key = "users";
			attrs.query =  {
				id: attrs.name,
				password: attrs.password
			};

			DBService._get(attrs);
		};

		$scope.initUser = function (attrs) {
			console.log(attrs);
			if (attrs instanceof Array) attrs = attrs[0];
		
			if(attrs) {				
				attrs.logged = true;
				$scope.user = attrs;
				$scope.getAccessRange();
				
				$scope.redirectToView();
			} else {
				console.log("no attrs in user init");
			}

			
		};

		$scope.checkLogin = function () {
			var user = JSON.parse(localStorage.getItem('user'));

			if (user && user.logged) {
				DBService._get({
					key: "users",
					query: {
						id: user.id
					},
					callback: $scope.initUser
				});

			} else {
				console.log("no local user");
				$scope.redirectToView("/");
			}
		};

		$scope.import = function () {
			$http.get('/admin/db/import/products')
				.success(function () {
					$scope.getDataList(false);
				});
		};

		$scope.drop = function () {
			if ($scope.selectedBase) {
				$http.get('/admin/db/drop/' + $scope.selectedBase)
				.success(function () {
					$scope.getDataList(false);
				});
			}
		};

		$scope.update = function () {
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
		};

		$scope.init = function () {
			$scope.sidebarList = DBService.getData({ "fieldId": "fields" });
			$scope.update();
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});
}