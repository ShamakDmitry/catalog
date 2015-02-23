//Database
var exports = module.exports = {};

var mongoose = exports.mongoose = require('mongoose');

var appCnfg;

try {
	appCnfg = JSON.parse(process.env.APP_CONFIG);
} catch (err) {

}

var config = {
	mongo: {
	    user: "app_304",
		password: "mongoevennodepa33",
		host: "localhost",
		db: "test"
	}
};

if (appCnfg) {
	mongoose.connect("mongodb://" + appCnfg.mongo.user + ":" + config.mongo.password + "@" +
	appCnfg.mongo.host + ":" + appCnfg.mongo.port + "/" + appCnfg.mongo.db,
	function (err, db) {
		if(!err) {
			//res.end("We are connected to MongoDB\n");
			console.log(("We are connected to MongoDB\n"));
		} else {
			//res.end("Error while connecting to MongoDB\n");
			console.log("Error while connecting to MongoDB");
		}
	});
} else {
	mongoose.connect("mongodb://" + config.mongo.host + "/" + config.mongo.db);
}

var UserSchema = exports.UserSchema = new mongoose.Schema({
	id: String,
	group: String,
	name: String,
	password: String
});

var ProductSchema = exports.ProductSchema = new mongoose.Schema({
	title: String,
	image: String,
	props: Object,
	rate: Number,
	price: String,
	curency: String,
	description: String
});
var GroupSchema = exports.GroupSchema = new mongoose.Schema({
	title: String,
	password: String,
	access: String
});
var ContactSchema = exports.ContactSchema = new mongoose.Schema({
	title: String,
	description: String
});
var NewslistSchema = exports.NewslistSchema = new mongoose.Schema({
	label: String,
	time: String,
	title: String
});

var OrderSchema = exports.UserSchema = new mongoose.Schema({
	timestamp: String,
	order: String,
	name: String,
	telephone: String,
	address: String
});

var DB = exports.DB = null;
//var ProductsDB = exports.ProductsDB = mongoose.model('Products', ProductSchema);

var db = exports.db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log("Hello DB");
	//db.db.dropDatabase();
});

exports._getDatabase = function (type) {
	switch (type) {
		case "users":
			DB = mongoose.model('Users', UserSchema);
			break;
		case "products":
			DB = mongoose.model('Products', ProductSchema);
			break;
		case "group":
			DB = mongoose.model('Group', GroupSchema);
			break;
		case "aboutus":
			DB = mongoose.model('Contact', ContactSchema);
			break;
		case "newslist":
			DB = mongoose.model('Newslist', NewslistSchema);
			break;
		case "order":
			DB = mongoose.model('Orders', OrderSchema);
			break;
		default:
			DB = false;
			break;
	}

	return DB;
};

exports.checkForJson = function (query) {
	var res;
	try {
		res = JSON.parse(query);
	} catch (err) {
		res = {};
	}

	return res;
};

exports.requestCallback = function (res, err, data) {
	if (err) {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end(err);
	}
	else {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(data));
	}
};

exports._get = function (res, attrs) {
	var database = exports._getDatabase(attrs.key);

	attrs.query = exports.checkForJson(attrs.query);

	if (database) {
		database.find(attrs.query, function (err, data) {
			exports.requestCallback(res, err, data);
		});
	} else {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end("no such database");
	}

};

exports._import = function (res, attrs) {
	var database = exports._getDatabase(attrs.key);

	if (database) {
		database.find(attrs.query, function (err, data) {
			exports.requestCallback(res, err, data);
		});
	} else {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end("no such database");
	}

};

exports._delete = function (res, attrs) {
	var database = exports._getDatabase(attrs.key);

	attrs.query = exports.checkForJson(attrs.query);

	if (database) {
		database.remove(attrs.query, function (err, data) {
			exports.requestCallback(res, err, data);
		});
	} else {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end("no such database");
	}

};


exports.checkData = function (attrs) {
	var res;

	var obj = (attrs.data) ? attrs.data : attrs;

	for (var key in obj) {
		if (!res) res = {};

		if (obj[key]) res[key] = obj[key];
	}
	return res;
};

exports.dropCollection = function(res, attrs) {
	var database = exports._getDatabase(attrs.key);

	if (database)
		database.remove({}, function (err) {
			exports.requestCallback(res, err);
		});
	else res.end();

	
};

exports._set = function (res, attrs) {
    //add data
    console.log("_SET", attrs);
	var database = exports._getDatabase(attrs.key);
	if (attrs.data) {
		attrs.data = exports.checkData(attrs.data);

		var item = new database(attrs.data);

		item.save(function (err) {
			if(res) exports.requestCallback(res, err, attrs.data);
		});
	} else {
		console.log("Error: ", attrs.data);
		return false;
	}
};

exports._update = function (res, attrs) {
	//update data
	var database = exports._getDatabase(attrs.key);

	attrs.query = exports.checkForJson(attrs.query);
	attrs.data = exports.checkData(attrs);

	if (database) {
		database.update(attrs.query, { $set: attrs.data }, function (err, data) {
			exports.requestCallback(res, err, data);
		});
	} else {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end("no such database");
	}
};

exports._remove = function (res, attrs) {
	//remove field
};
//Database -------------------
