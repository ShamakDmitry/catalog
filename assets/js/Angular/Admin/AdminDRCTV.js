if (myApp) {
	myApp.directive('sidebarItem', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				//get data for this item
				scope.unselectDataListItem();
				scope.unselectSidebarItem();

				scope.getDataList(attrs["sidebarItem"]);
				scope.closeSelectedItem();
				element.addClass("active");
			});
		}
	}]);

	myApp.directive('sidebarAddBtn', function ($window, $timeout) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				//add new item
				$timeout(function () {
					if (attrs["sidebarAddBtn"] != "users") scope.addNewItem(attrs["sidebarAddBtn"]);
				});
			});
		}
	});

	myApp.directive('datalistItem', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				//open item in editor
				angular.element('#data-list li.active').removeClass("active");
				scope.selectDataItem(attrs["datalistItem"], scope.$index);
				element.addClass("active");
			});
		}
	}]);

	myApp.directive('groupField', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('change', function () {
				//open item in editor
				switch (scope.groupName) {
					case "none":
						scope.groupName = false;
						break;
				}

				scope.update();
			});
		}
	}]);

	myApp.directive('editBtn', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				//close selected item
				switch (attrs["editBtn"]) {
					case "edit":
						scope.toggleEditMode(true);
						break;
					case "save":
						scope.validateBeforeAction({
							callback: scope.saveEdit
						});
						break;
					case "delete":
						scope.deleteItem();
						break;
					case "cancel":
						scope.cancelEdit();
						break;
				}
			});
		}
	}]);

	myApp.directive('closeSelectedItem', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				//close selected item
				scope.unselectDataListItem();
				scope.closeSelectedItem();
			});
		}
	}]);

	myApp.directive('loginForm', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('submit', function () {
				var attrs = {};
				attrs.name = scope.userName;
				attrs.password = scope.userPassword;

				scope.onLoginFormSubmit(attrs);
			});
		}
	}]);

	myApp.directive('registrationForm', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('submit', function () {
				var attrs = {};
				attrs.id = scope.userId;
				attrs.name = scope.userName;
				attrs.password = scope.userPassword;
				attrs.confirmPassword = scope.userConfirmPassword;

				attrs.groupName = scope.groupName;
				attrs.groupPassword = scope.groupPassword;

				scope.onRegistrationFormSubmit(attrs);
			});
		}
	}]); 

	myApp.directive('logoutBtn', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				scope.logout();
			});
		}
	}]);

	myApp.directive('dbBtn', ['$window', function ($window) {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				if (scope[attrs["dbBtn"]]) scope[attrs["dbBtn"]]();
			});
		}
	}]);
}