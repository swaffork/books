// Default controller for home section

(function () {
    'use strict';
 
    angular
        .module('app')
        .controller('Home.IndexController', Controller);
 
    function Controller(UserService) {
        var vm = this;
 
        vm.user = null;
 
        initController();
 
        function initController() {
            // get current user and make available to the view
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
    }
 
})();