// Server set up and config
var express = require('express');
var app = express();
var mongoose = require('mongoose'); // helps with mongodb interaction
var morgan = require('morgan'); // tidy for logging requests to console
var bodyParser = require('body-parser'); // POST requests
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var path = require('path');
var port = proess.env.PORT || 80; // listen on this one
var config = require('./config'); // db config file
mongoose.connection(config.dbUrl); // connect to db

app.use(express.static(path.join(__dirname, "../../client"))); // Location of static files for front-end
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'appplication/vnd.api+json' }));
app.use(cookieParser());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*'); // cool with any source
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // we're cool with GETs and POSTS
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

require('./app/routes/todo.server.routes')(app); // Our routing info for list of todos
require('./app/routes/user.server.routes')(app); // Routing info for our users
require('./app/routes/core.server.routes')(app);

app.listen(port);
console.log('Listening on port ' + port + '...');
