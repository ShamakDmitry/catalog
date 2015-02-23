if (myApp) {
    myApp.controller('Contacts', function ($scope, $http, DBService) {
        $scope.contacts = [];

        $scope.init = function () {
            $scope.checkAttrs();
            if (DBService) {
                DBService._get({
                    key: "contacts",
                    query: "",

                    callback: function (data) {
                        $scope.contacts = data;
                        console.log(data);
                    }
                });
            }
        };

        $scope.$on('$viewContentLoaded', $scope.init());
    });
}