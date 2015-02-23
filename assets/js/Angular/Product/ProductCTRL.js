if (myApp) {
	myApp.controller('Product', function ($scope, $http, DBService) {
		$scope.screenPoint = 0;

		$scope.selectedProducts = null;
		$scope.cols = [];

		$scope.selectProduct = function (element, ind) {
			//element.closest(".product").addClass("selected");
			$scope.getProductByInd(ind).status = "selected";

			$scope.addToBasket(ind);
		};

		$scope.toggleBuyList = function (bool) {
			$scope.isBuyListActive = (typeof bool == "boolean") ? bool : !$scope.isBuyListActive;

			if ($scope.isBuyListActive) $scope.selectedProducts = $scope.getBuyItemsList();
			else {
				$scope.selectedProducts = null;

				//clear fields
				$scope.userName = "";
				$scope.userTelephone = "";
			}

			$scope.update();
		};

		$scope.$on("toggleBuyList", function () {
			$scope.toggleBuyList();
		});

		$scope.unselectProduct = function (element, ind) {
			if (ind) {
				$scope.getProductByInd(ind).status = "none";
				$scope.removeFromBasket(ind);
			}
			else {
				$scope.updateProductsView("none");
				$scope.basket.list = [];
				$scope.updateBasket();
			}
		};

		$scope.updateBasket = function () {
			$scope.basket.num = $scope.basket.list.length;

			$scope.update();
		};

		$scope.addToBasket = function (ind) {
			$scope.basket.list.push(ind);
			
			$scope.updateBasket();
		};

		$scope.removeFromBasket = function (ind) {
			$scope.getProductByInd(ind);
			$scope.basket.list.splice($scope.basket.list.indexOf(ind), 1);
			
			$scope.updateBasket();
		};

		$scope.getProductByInd = function (ind) {
			var key = ind.split(",");
			var prod = ($scope.cols[key[0]]) ? ( ($scope.cols[key[0]][key[1]]) ? $scope.cols[key[0]][key[1]]: false ) : false;

			return prod;
		};

		$scope.getColsNum = function (ignoreWidth) {
			var width = $('#content').width();

			var res = (width >= 1200) ? 4 : ((width > 700) ? 3 : ((width > 500) ? 2 : 1));

			if ($scope.screenPoint != res || ignoreWidth) $scope.screenPoint = res;
			else res = false;

			return res;
		};

		$scope.checkProdImage = function (image) {
			//console.log("image", image);
			if (!image)
				image = "assets/imgs/empty.png"

			return image;
		};

		$scope.updateProductsView = function (selector) {
			var num = $scope.basket.num;
			if(num) {
				for (var i = 0; i < num; i++) {
					var ind = $scope.basket.list[i];
					if($scope.getProductByInd(ind)) $scope.getProductByInd(ind).status = selector;
				}
			}
		};

		$scope.initCols = function (data) {
			if (data && data.length) {

				var elem_custom_class = "product-list clearfix",
					col_num = $scope.getColsNum(true),
					factor = 0;

				$scope.cols = [];

				for (var i = 0; i < data.length; i++) {
					data[i].col = factor;

					if (!$scope.cols[factor]) $scope.cols[factor] = [data[i]];
					else $scope.cols[factor].push(data[i]);
					factor++;
					if (factor >= col_num) factor = 0;
				}

				$('#content .product-list').attr('class', elem_custom_class).addClass('col_' + col_num);

				$scope.updateProductsView("selected");

				$scope.update();
			}
		};

		$scope.getBuyItemsList = function () {
			var num = $scope.basket.num,
				res = [];

			if (num) {
				for (var i = 0; i < num; i++) {
					var ind = $scope.basket.list[i];
					var prod = $scope.getProductByInd(ind);
					if (prod) res.push({
						id: prod._id,
						title: prod.title,
						price: prod.price,
						curency: prod.curency
					});
				}
			}

			return res;
		};

		$scope.showBuyError = function (attrs) {
			//console.log(attrs.text);
		};

		$scope.orderCallback = function (data) {
			$scope.unselectProduct();
			$scope.toggleBuyList(false);
		};

		$scope.sendOrder = function (attrs) {
			var template = new Order(attrs);

			DBService._set({
				key: "order",
				query: "",
				data: template,
				callback: $scope.orderCallback
			});
		};

		$scope.isValidForBuy = function (attrs) {
			res = false;

			res = (attrs.name && attrs.telephone) ? true : false;

			return res;
		};

		$scope.onBuyFormSubmit = function (attrs) {
			if (attrs && $scope.isValidForBuy(attrs)) {

				attrs.order = "";
				var selectedProducts = $scope.selectedProducts;

				for (var key in selectedProducts) {
					attrs.order += (attrs.order != "") ? "@" + selectedProducts[key].id : selectedProducts[key].id;
				}

				$scope.sendOrder(attrs);
			} else $scope.showBuyError({text: "Не все поля заполнены"});
		};

		$scope.getProducts = function () {
			if (DBService && $scope.getColsNum()) {
				DBService._get({
					key: "products",
					query: "",

					callback: $scope.initCols
				});
			}
		};

		$scope.init = function () {
			$scope.checkAttrs();
			$scope.getProducts();

			//window.onresize = $scope.getProducts;
		};

		$scope.$on('$viewContentLoaded', $scope.init());
	});
}