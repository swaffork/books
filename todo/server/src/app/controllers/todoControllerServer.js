var mongoose = require('mongoose');
require('../models/todoModelServer');
var Todo = mongoose.model('Todo');

// How we get all the todos!
exports.findAll = function(req, res) {
	Todo.find({
		user: req.decoded._id
	}, function(err, todos) {
		if (err) {
			res.send(err);
		}

		res.json(todos);
	});
};
