// In Angular, a factory handles the actual REST requests
todoApp.factory('todosFactory', function($http) {
  var urlBase = '/api/todos';
  var _todoService = {};

  _todoService.getTodos = function() {
    return $http.get(urlBase);
  };

  _todoService.saveTodo = function(todo) {
    return $http.post(urlBase, todo);
  };

  // How we edit a todo (change name, mark done, etc)
  _todoService.updateTodo = function(todo) {
    return $http.put(urlBase, todo);
  };

  // How we permanently remove a todo! Wipe it from memory :0
  _todoService.deleteTodo = function(id) {
    return $http.delete(urlBase + '/' + id);
  };

  return _todoService;
});
