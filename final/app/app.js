// Entry point for application

(function () {
    'use strict';
 
	// declare app module and dependencies
    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);
 
	// define routes of application - TODO: 2nd entity
    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");
 
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });
    }
 
    function run($http, $rootScope, $window) {
        // add JWT token as default auth header required to authenticate to api
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
 
        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }
 
    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
 
            angular.bootstrap(document, ['app']);
        });
    });
})();