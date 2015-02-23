if (myApp) {
	myApp.config(function ($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl: '/assets/view/main/home.html',
			controller: 'Home'
		})
		$routeProvider.when('/', {
			templateUrl: '/assets/view/main/home.html',
			controller: 'Home'
		})
		.when('/products', {
			templateUrl: '/assets/view/main/products.html',
			controller: 'Product'
		})
        .when('/services', {
            templateUrl: '/assets/view/main/services.html',
            controller: 'Services'
        })
        .when('/info', {
            templateUrl: '/assets/view/main/info.html',
            controller: 'Info'
        })
        .when('/gallery', {
            templateUrl: '/assets/view/main/gallery.html',
            controller: 'Gallery'
        })
        .when('/contacts', {
            templateUrl: '/assets/view/main/contacts.html',
            controller: 'Contacts'
        })
		.when('/aboutus', {
			templateUrl: '/assets/view/main/aboutus.html',
			controller: 'Aboutus'
		})
		.otherwise({
			template: '<div class="nopage error">no page found 8(</div>'
		})
		.when('/home/:id/', {
			//templateUrl: '/detail.html',
			controller: 'Main',
			resolve: {
				load: function ($route, dataService) {
					return dataService.load($route.current.params.id);
				}
			}
		});
		/*.when('/detail/:id/', {
			templateUrl: '/detail.html',
			controller: 'DetailCtrl',
			resolve: {
				load: function ($route, dataService) {
					return dataService.load($route.current.params.id);
				}
			}
		});*/
	});
}