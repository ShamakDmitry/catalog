if (myApp) {
	myApp.directive('basketBtn', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				scope.toggleBuyList();
			});
		}
	}])
	.directive('toggleNav', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				scope.toggleNavigation($('#side-bar'));
			});
		}
	}]);
}