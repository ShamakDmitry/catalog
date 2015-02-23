var myApp;

if (!myApp) myApp = angular.module('App', ['ngRoute']);

myApp.directive('navLink', ['$window', function ($window) {
	return function (scope, element, attrs) {
		element.bind('click', function () {
			scope.navLinkCallback(element);
		});
	}
}]);