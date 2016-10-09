// Initialize our controller!
// controller = todoApp
// dependencies = ngRoute
todoApp = angular.module('todoApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/todo.html',
        controller: 'TodoController'
      }).otherwise({
        redirectTo: '/'
      });
  });
