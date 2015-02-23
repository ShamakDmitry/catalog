if (myApp) {
	myApp.controller('Home', function ($scope, $http, DBService) {
		$scope.newslist = [];

		var date = new Date();
		$scope.date = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();

		$scope.formateData = function (data) {
			var res = {};

			for(key in data) {
				if (!res[data[key].label])
					res[data[key].label] = {
						label: data[key].label,
						news : []
					};

				res[data[key].label].news.push(data[key]);
			}

			$scope.newslist = res;
		};

		$scope.init = function () {
			$scope.checkAttrs();
			if (DBService) {
				DBService._get({
					key: "newslist",
					query: "",

					callback: $scope.formateData
				});
			}
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});
}