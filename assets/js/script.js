//Templates START
function User(attrs) {
	this.id = attrs.id;
	this.name = (attrs.name) ? attrs.name : attrs.id;
	this.password = attrs.password;
	this.group = (attrs.group) ? attrs.group : "none";

	initionCallback.apply(this);
}

function Product(attrs) {
	this.id = attrs._id;
	this.title = (attrs.title) ? attrs.title : "Empty title";
	this.image = attrs.image;
	this.props = attrs.props;
	this.rate = attrs.rate;
	this.price = attrs.price;
	this.curency = attrs.curency;
	this.description = attrs.description;

	initionCallback.apply(this);
}

function Group(attrs) {
	this.title = (attrs.title) ? attrs.title : "Empty title";
	this.access = attrs.access;
	this.password = attrs.password;

	initionCallback.apply(this);
}

function Contact(attrs) {
	this.title = (attrs.title) ? attrs.title : "Empty title";
	this.description = attrs.description;

	initionCallback.apply(this);
}

function News(attrs) {
	this.title = (attrs.title) ? attrs.title : "Empty title";
	this.label = attrs.label;
	this.time = attrs.time;

	initionCallback.apply(this);
}

function Order(attrs) {
	this.timestamp = new Date().getTime();
	this.order = attrs.order;
	this.name = (attrs.name) ? attrs.name : attrs.id;
	this.telephone = attrs.telephone;
	this.address = (attrs.address) ? attrs.address : "none";

	initionCallback.apply(this);
}
//Templates END ------------------

var initionCallback = function () {
	for(var key in this) {
		if (!this[key]) this[key] = "";
	}
};

$(document).ready(function () {//replace with angular directive
	$('.resize-btn').click(function () {
		$('#side-bar').toggleClass('hidden');
	});
});