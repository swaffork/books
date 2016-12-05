// place service encapsulates interaction with api for all location related CRUD operations

(function () {
    'use strict';
 
    angular
        .module('app')
        .factory('PlaceService', Service);
 
    function Service($http, $q) {
        var service = {};
 
        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByCityname = GetByCityname;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
 
        return service;
 
        function GetCurrent() {
            return $http.get('/api/places/current').then(handleSuccess, handleError);
        }
 
        function GetAll() {
            return $http.get('/api/places').then(handleSuccess, handleError);
        }
 
        function GetById(_id) {
            return $http.get('/api/places/' + _id).then(handleSuccess, handleError);
        }
 
        function GetByCityname(cityname) {
            return $http.get('/api/places/' + cityname).then(handleSuccess, handleError);
        }
 
        function Create(place) {
            return $http.post('/api/places', place).then(handleSuccess, handleError);
        }
 
        function Update(place) {
            return $http.put('/api/place/' + place._id, place).then(handleSuccess, handleError);
        }
 
        function Delete(_id) {
            return $http.delete('/api/places/' + _id).then(handleSuccess, handleError);
        }
 
        // private functions
 
        function handleSuccess(res) {
            return res.data;
        }
 
        function handleError(res) {
            return $q.reject(res.data);
        }
    }
 
})();