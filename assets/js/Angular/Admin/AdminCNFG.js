if (myApp) {
	myApp.config(function ($routeProvider) {
		$routeProvider.when('/logged', {
			templateUrl: '/assets/view/admin/logged.html',
			controller: 'Logged'
		})
		.when('/order', {
			templateUrl: '/assets/view/admin/order.html',
			controller: 'Order'
		})
		.when('/registration', {
			templateUrl: '/assets/view/admin/registration.html',
			controller: 'Registration'
		})
		.otherwise({
			templateUrl: '/assets/view/admin/login.html',
			controller: 'Login'
		});
	});
}