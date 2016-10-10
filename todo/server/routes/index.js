(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var mongojs = require('mongojs');
  var db = mongojs('mongodb://admin:admin123@ds063809.mongolab.com:63809/meantodo', ['todos']);

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/api/todos', function(req, res) {
    db.todos.find(function(err, data) {
      res.json(data);
    });
  });

  // Create a new to-do
  router.post('/api/todos', function(req, res) {
    db.todos.insert(req.body, function(err, data) {
      console.log(req.body.todo);
      res.json(data);
    });

  });

  // PUT method places a resource exactly at provided URI (server will not apply req to different resource)
  router.put('/api/todos', function(req, res) {

    console.log('Todo:' + req.body.todo + ', priority: ' + req.body.priority + ', userType: ' + req.body.userType);
    db.todos.update({
      _id: mongojs.ObjectId(req.body._id)
    }, {
      isCompleted: req.body.isCompleted,
      todo: req.body.todo,
      user: req.body.user,
      priority: req.body.priority,
      userType: req.body.userType
    }, {}, function(err, data) {
      res.json(data);
    });

  });

  // Remove todo completely (NOT mark as done!)
  router.delete('/api/todos/:_id', function(req, res) {
    db.todos.remove({
      _id: mongojs.ObjectId(req.params._id)
    }, '', function(err, data) {
      res.json(data);
    });

  });

  module.exports = router;

}());
