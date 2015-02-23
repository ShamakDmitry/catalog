if (myApp) {
	myApp.controller('Login', function ($scope, $http, $location, DBService) {
		$scope.clearLoginFields = function (field) {
			if (field) {
				if(field == "name") $scope.userName = "";
				else $scope.userPassword = "";
			} else {
				$scope.userName = "";
				$scope.userPassword = "";
			}

			$scope.update();
		};

		$scope.showLoginError = function(attrs) {
			$scope.loginErrorText = attrs.text;

			$scope.update();
		};

		$scope.clearErrorField = function () {
			$scope.loginErrorText = null;

			$scope.update();
		};

		$scope.userExists = function (attrs) {
			$scope.clearErrorField();

			if (attrs && ((attrs instanceof Array) ? attrs.length : true)) {
				if (attrs.length) attrs = attrs[0];

				$scope.login(attrs);
			} else {
				$scope.showLoginError({
					text: "Please, check your username and password"
				});
			}
			
		};

		$scope.onLoginFormSubmit = function (attrs) {
			attrs.name = (attrs.name || attrs.name != "") ? attrs.name : false;
			attrs.password = (attrs.password || attrs.password != "") ? attrs.password : false;

			if (attrs.name && attrs.password) {
				$scope.getUser({
					name: attrs.name,
					password: attrs.password,
					callback: $scope.userExists,
					errorCallback: $scope.showLoginError,
					errorAttrs: {
						'text': "Please insert " + ((!attrs.name) ? "username" : "") + ((!attrs.name && !attrs.password) ? " and " : "") + ((!attrs.password) ? "password" : "")
					}
				});
			} else {
				$scope.showLoginError({
					'text': "Please insert " + ((!attrs.name) ? "username" : "") + ((!attrs.name && !attrs.password) ? " and " : "") + ((!attrs.password) ? "password" : "")
				});
			}
		};

		$scope.login = function (attrs) {
			$scope.user = attrs;
			var user = {
				id: attrs.id,
				logged: true
			};

			localStorage.setItem('user', JSON.stringify(user));

			$scope.checkLogin();
		};

		$scope.init = function () {
			$scope.checkLogin();

			$scope.update();
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});
}