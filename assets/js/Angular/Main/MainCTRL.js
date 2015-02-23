if (myApp) {
	myApp.controller('Main', function ($scope, $http, $location) {
		$scope.basket = ($scope.basket != undefined) ? $scope.basket : {list: [], 'num': 0};
		$scope.canShowBasket = false;
		$scope.isBuyListActive = false;

		$scope.navLinks = [
			{
				'title': "Новости",
				'url': "#home",
				'icon': "home"
			}, {
				'title': "Каталог",
				'url': "#products",
				'icon': "product"
			}, {
			    'title': "Виды потолков",
			    'url': "#info",
			    'icon': "info"
			}, {
			    'title': "Галерея",
			    'url': "#gallery",
			    'icon': "gallery"
			}, {
			    'title': "Услуги",
			    'url': "#services",
			    'icon': "services"
			}, {
			    'title': "О нас",
			    'url': "#aboutus",
			    'icon': "aboutus"
			}, {
				'title': "Контакты",
				'url': "#contacts",
				'icon': "contacts"
			}/*, {
				'title': "Admin",
				'url': "/admin",
				'icon': "admin"
			}*/
		];

		$scope.navLinksInd = {
			'home': 0,
			'products': 1,
			'info': 2,
			'gallery': 3,
			'aboutus': 4,
			'contacts': 5
		};

		$scope.navLinkCallback = function (elem) {
			$('.nav-link.active').removeClass('active');
			$(elem).addClass('active');
		};

		$scope.toggleBuyList = function () {
			$scope.$broadcast("toggleBuyList");
		};

		$scope.toggleNavigation = function (element) {
			element.toggleClass("hidden");
		};

		$scope.checkAttrs = function () {
			var path = ($location.path()).replace("/", "");
			switch (path) {
				case "products":
					$scope.canShowBasket = true;
					break;
				default:
					$scope.canShowBasket = false;
					$scope.isBuyListActive = false;
					break;
			}
		};

		$scope.initNavigation = function () {
			var hash = (window.location.hash).replace('#', "").replace('/', "");
			var ind = 0,
				elemInd = ($scope.navLinksInd[hash]) ? $scope.navLinksInd[hash] : 0;

			if ($('.nav-link').length) {
				$('.nav-link').each(function () {
					if (ind == elemInd) {
						$(this).addClass('active');
					}
					ind++;
				});
			} else {
				setTimeout($scope.initNavigation, 0);
			}
		};

		$scope.update = function () {
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
		};

		$scope.init = function () {
			$scope.initNavigation();

			$scope.update();
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});
}