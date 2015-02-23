if (myApp) {
	myApp.controller('Logged', function ($scope, $http, $location) {
		$scope.access_icons = {
			"open": {
				icon: "open"
			},
			"edit": {
				icon: "edit"
			},
			"adduser": {
				icon: "adduser"
			}
		};

		$scope.checkForNested = function(value) {
			var res = [],
				length = value.length;
				base = $scope.selectedBase;

			if (length) {
				for (var i = 0; i < length; i++) {
					res.push( ($scope.getFormatedViewOfField(value[i])).replace(",", ": ") );
				}
			}

			return res;
		};

		$scope.getFormatedViewOfField = function (value) {
			var res = null,
				type = (value instanceof Array) ? "array" : typeof value;

			if (type && type != "undefined") {
				switch (type) {
					case "array":
						res = $scope.checkForNested(value);

						res = res.toString();
						break;
					case "object":
						res = [];
						for(var key in value) {
							res.push(value[key]);
						}
						res = $scope.getFormatedViewOfField(res);
						break;
					default:
						res = (value != "") ? value : "empty field";
						break;
				}
			} else {
				res = "empty field";
			}

			return res;
		};

		$scope.init = function () {
			$scope.checkLogin();

			if ($scope.user.logged) {
				if ($scope.selectedItem || $scope.selectedBase) {
					$scope.clearSelections();
				}
			}


			$scope.update();
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});
}