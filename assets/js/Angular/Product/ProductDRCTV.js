if (myApp) {
	myApp.directive('selectProductBtn', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				scope.selectProduct(element, attrs["selectProductBtn"]);
			});
		}
	}])
	.directive('unselectProductBtn', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				scope.unselectProduct(element, attrs["unselectProductBtn"]);
			});
		}
	}])
	.directive('closeBuyListBtn', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				scope.toggleBuyList(false);
			});
		}
	}])
	.directive('buyForm', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('submit', function () {
				var attrs = {};

				attrs.name = scope.userName;
				attrs.telephone = scope.userTelephone;

				scope.onBuyFormSubmit(attrs);
			});
		}
	}]);
}