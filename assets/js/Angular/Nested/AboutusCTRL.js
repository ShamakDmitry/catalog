if (myApp) {
	myApp.controller('Aboutus', function ($scope, $http, DBService) {
		$scope.aboutus = [];

		$scope.init = function () {
			$scope.checkAttrs();
			if (DBService) {
				DBService._get({
					key: "aboutus",
					query: "",

					callback: function (data) {
						$scope.aboutus = data;
						console.log(data);
					}
				});
			}
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});
}