if (myApp) {
	myApp.controller('Order', function ($scope, $http, $location, $rootScope, DBService) {
		$scope.nextUploadedInd = 0;
		$scope.total = 0;
		var d = new Date();

		$scope.initOrders = function (data) {
			$scope.clearSelections();
			$scope.$parent.selectedBase = "order";

			if (data instanceof Object) {
				for (var i = 0; i < data.length; i++) {
					data[i].date = $scope.getDate(data[i].timestamp);
				}

				$scope.$parent.dataList = data;
			}
			else $scope.$parent.dataList = [];

			$scope.accessParams.canOpen = true;
			$scope.accessParams.canEdit = true;


			$scope.update();
		};

		$rootScope.$on("orderData", function() {
			$scope.getOrdersData();
		});

		$scope.getOrdersData = function () {
			DBService._get({
				key: "order",
				query: "",

				callback: $scope.initOrders
			});

			$scope.update();
		};

		$scope.getOrderItemView = function (data) {
			var res = {};
			
			if (data && data.length) {
				data = (data instanceof Array) ? data[0] : data;

				res.title = data.title;
				res.price = data.price;
				res.loaded = true;
			} else {
				res.loaded = false;
			}

			return res;
		};

		$scope.getDate = function (timestamp) {
			d.setTime(timestamp);
			var date = (d.getMonth() + 1) + "." + (d.getDate()) + "." + (d.getFullYear()) + " - " + (d.getHours()) + ":" + (d.getMinutes());
			return date;

			$scope.update();
		};

		$scope.setOrderItem = function (data) {
			if ($scope.nextUploadedInd < $scope.selectedItem.order.length) {
				var data = $scope.getOrderItemView(data);
				$scope.selectedItem.order[$scope.nextUploadedInd] = data;

				$scope.total += parseInt(data.price);
				$scope.nextUploadedInd++;
			} else $scope.nextUploadedInd = 0;

			$scope.update();
		};

		$scope.getOrders = function () {
			$scope.total = 0;
			$scope.nextUploadedInd = 0;

			var ordersId = $scope.selectedItem.order;
			
			for (var i = 0; i < ordersId.length; i++) {
				DBService._get({
					key: "products",
					query: JSON.stringify({
						_id: ordersId[i]
					}),

					callback: $scope.setOrderItem
				});
			}

			$scope.update();
		};

		$scope.init = function () {
			$scope.checkLogin();

			if ($scope.user.logged) {
				if ($scope.selectedItem || $scope.selectedBase) {
					$scope.clearSelections();
				}
			}

			$scope.getOrdersData();

			$scope.update();
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});
}