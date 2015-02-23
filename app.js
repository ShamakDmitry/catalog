var http = require("http"),
	url = require("url"),
    path = require("path"),
	fs = require('fs'),

	db = require('./assets/js/DB.js'),

	backups = require('./assets/js/Backups.js'),

	express = require('express');

var app = express();

app.use(express.static(__dirname + '/'));
app.use('/simple', express.static(__dirname + '/'));
app.use('/assets', express.static(__dirname + '/'));

app.get('/admin', function (req, res) {
	setPage(req, res, "/admin.html");
});

app.get('/:type?/:key?/:query?', function (req, res) {
	var attrs = {
		key: req.params.key,
		query: req.params.query
	};

	if (db["_" + req.params.type]) db["_" + req.params.type](res, attrs);
});

app.get('/simple/:max?/:min?/:length?', function (req, res) {
    var attrs = {
        max : parseInt(req.params.max),
        min: parseInt(req.params.min),
        length: parseInt(req.params.length)
    };

    console.log(attrs);

    var data = [];

    for (var i = 0; i < attrs.length; i++) {
        var rand = attrs.min + Math.random() * (attrs.max - attrs.min);
        rand = (parseInt(rand)).toFixed();

        data.push(rand);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
});

app.get('/admin/db/:type?/:key?', function (req, res) {
	var data = backups.Products,
		key = req.params.key,
		type = req.params.type;

	switch (type) {
		case "import":
			var length = data.length;

			for (var i = 0; i < length; i++) {
				var attrs = {
					key: key,
					data: data[i]
				};

				if (i < (length - 1))
					db._set(false, attrs);
				else
					db._set(res, attrs);
			}


			break;
		case "drop":
			db.dropCollection(res, {
				key: key
			});
			break;
	}
});

app.post('/:type?/:key?/:query?', function (req, res) {
	var	attrs = {
		key: req.params.key,
		query: req.params.query,
		data: null
	};

	req.on('data', function (data) {
		attrs.data = JSON.parse(data);
	});
	req.on('end', function () {
		if (db["_" + req.params.type]) db["_" + req.params.type](res, attrs);
		else res.end();
	});
});

app.get('/delete/:key?/:id?', function (req, res) {
	var attrs = {
		key: req.params.key,
		query: {
			_id: req.params.id
		}
	};
	db._delete(res, attrs);
});

app.get('/admin:id', function (req, res) {
	res.writeHead(500, { "Content-Type": "application/json" });
	res.write("Hello");
	res.end();
});

function setPage(req, res, page) {
	var filename = process.cwd() + page;
	fs.readFile(filename, "binary", function (err, file) {
		if (err) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.write(err + "\n");
			res.end();
			return;
		}

		res.writeHead(200);
		res.write(file, "binary");
		res.end();
	});
}

http.createServer(app).listen(3000);