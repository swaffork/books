// Default controller for our one page app!
todoApp.controller('TodoController', function($rootScope, $scope, todosFactory) {

  // Todos are just a collection of objects
  $scope.todos = [];
  $scope.isEditable = [];

  // Whenever we load the page, we want to load all of the todos into scope
  todosFactory.getTodos().then(function(data) {
    $scope.todos = data.data;
  });

  // When we create a new todo, send it to the saveTodo method in our factory!
  // Default to not completed; TBC - more data here! "priority": $scope.todoPriority?
  // Flush input for next todo
  $scope.save = function($event) {
    if ($event.which == 13 && $scope.todoInput && $scope.userInput) { // make sure all fields filled out

      todosFactory.saveTodo({ // write to model
        "todo": $scope.todoInput,
        "isCompleted": false,
		"user": $scope.userInput
      }).then(function(data) { // write to view
        $scope.todos.push(data.data);
      });
      $scope.todoInput = ''; // flush input
      $scope.userInput = '';
    }
  };

  // PUT request is how we'll edit the todo!
  // _t = actual todo we're editing,
  // isCompleted = if box is checked or not??
  // ex. priority: _t.priority
  $scope.updateStatus = function($event, _id, i) {
    var cbk = $event.target.checked;
    var _t = $scope.todos[i];
    todosFactory.updateTodo({
      _id: _id,
      isCompleted: cbk,
      todo: _t.todo
    }).then(function(data) {
      if (data.data.updatedExisting) {
        _t.isCompleted = cbk;
      } else {
        alert('Oops something went wrong!');
      }
    });
  };

  // If we're changing an existing todo, we want to remove whitespace from input,
  // change our editing state to NOT editing,
  // and also log what changes are happening
  // TBC: test case! If we weren't able to edit, send an alert!
  $scope.edit = function($event, i) {
    if ($event.which == 13 && $event.target.value.trim()) {
      var _t = $scope.todos[i];
      todosFactory.updateTodo({
        _id: _t._id,
        todo: $event.target.value.trim(),
        isCompleted: _t.isCompleted
      }).then(function(data) {
              console.log(data);
        if (data.data.updatedExisting) {
          _t.todo = $event.target.value.trim();
          $scope.isEditable[i] = false;
        } else {
          alert('Oops something went wrong!');
        }
      });
    }
  };

  // If we simply want to get rid of a todo permanently, we call the factory's delete method
  // This removes the object from mongodb with matching id
  // When we get a response from the delete method, we change the scope's todo list
  // to NOT include the delete todo with splice
  // more at https://docs.mongodb.com/manual/tutorial/remove-documents/
  $scope.delete = function(i) {
    todosFactory.deleteTodo($scope.todos[i]._id).then(function(data) {
      if (data.data) {
        $scope.todos.splice(i, 1); // On success, remove 1 todo at index i in scope
      }
    });
  };

});
