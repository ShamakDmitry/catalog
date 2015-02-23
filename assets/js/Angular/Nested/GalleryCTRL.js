if (myApp) {
    myApp.controller('Gallery', function ($scope, $http, DBService) {
        var backup = [
            "/assets/imgs/catalog/alteza.by.jpg",
            "/assets/imgs/catalog/full_1314804923_poluprozr.jpg",
            "/assets/imgs/catalog/full_natyajnye-potolki1.jpg",
            "/assets/imgs/catalog/full_phoca_thumb_l_068.jpg",
            "/assets/imgs/catalog/phoca_thumb_l_dvyhyrovnevie-potolki-1.jpg",
            "/assets/imgs/catalog/phoca_thumb_l_fotopechat-3.jpg",
            "/assets/imgs/catalog/phoca_thumb_l_glianec-classic-1.jpg",
            "/assets/imgs/catalog/phoca_thumb_l_matovie-1.jpg"
        ];
        $scope.mainImage = false;
        $scope.gallery = [];

        $scope.toggleMainImage = function (url) {
            $scope.mainImage = url;
            console.log($scope.mainImage);

            $scope.update();
        };

        $scope.init = function () {
            $scope.checkAttrs();
            if (DBService) {
                DBService._get({
                    key: "gallery",
                    query: "",

                    callback: function (data) {
                        $scope.gallery = backup;
                        $scope.mainImage = $scope.gallery[0];

                        $scope.update();
                    }
                });
            }
        };

        $scope.$on('$viewContentLoaded', $scope.init());
    });

    myApp.directive('galleryImg', ['$window', function ($window) {
        return function (scope, element, attrs) {
            element.bind('click', function () {
                scope.toggleMainImage(attrs["galleryImg"]);
            });
        }
    }]);
}