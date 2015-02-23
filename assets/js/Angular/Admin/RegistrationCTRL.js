if (myApp) {
	myApp.controller('Registration', function ($scope, $http, $location, DBService) {
		$scope.clearLoginFields = function (field) {
			if (field) {
				if (field == "name") $scope.userName = "";
				else $scope.userPassword = "";
			} else {
				$scope.userName = "";
				$scope.userPassword = "";
			}

			$scope.update();
		};

		$scope.showLoginError = function (attrs) {
			$scope.loginErrorText = attrs.text;

			$scope.update();
		};

		$scope.clearErrorField = function () {
			$scope.loginErrorText = null;

			$scope.update();
		};

		$scope.addUser = function (template) {
		    console.log("add user");
		    if (template) {
		        console.log(template);
		        DBService._set({
		            key: "users",
		            query: "",
		            data: template,
		            callback: function () {
		                $scope.logout();
		                $scope.redirectToView("/");
		            }
		        });
		    } else {
		        console.log("Error");
		    }
		};

		$scope.generateGroupPass = function () {
		    var pass,
		        date = new Date();

		    pass = date.getMinutes() + date.getHours();

		    return pass;
		};

		$scope.onRegistrationFormSubmit = function (attrs) {
			var canAdd = true;
			//console.log(attrs);
			for (var key in attrs) {
				if(key != "groupName" || key != "groupPassword") {
					canAdd = (attrs[key] || attrs[key] != "") ? canAdd : false;
				}
			}

			if (canAdd && (attrs.password == attrs.confirmPassword)) {
				var key = "users";
				var template = $scope.getTemplate(key, attrs);

				if(attrs.groupName && attrs.groupName != "none") {
				    var groupPass = attrs.groupName + $scope.generateGroupPass();

				    if (attrs.groupPassword == groupPass) {
				        template.group = attrs.groupName;
				        $scope.addUser(template);
					}
					
				} else {
					console.log("no group", template);
					$scope.addUser({title: "admin" }, template);
				}				
			} else {
				console.log("Registration error", attrs);
			}
		};

		$scope.init = function () {
			$scope.update();
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});

}