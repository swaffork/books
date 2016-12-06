// encapsulates all data access and business logic, exposing place CRUD operations

var config = require('config.json');
var _ = require('lodash'); // modular methods for iterating arrays, creating composite functions...
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs'); // password hashing function
var Q = require('q'); // promises used to keep users api controller simple: methods can be called with [servicemethod].then(...).catch(...);
var mongo = require('mongoskin'); // MongoDB driver used to access db
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('places');
 
var service = {};
 
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
 
module.exports = service;
 
function getById(_id) {
    var deferred = Q.defer();
 
    db.places.findById(_id, function (err, place) {
        if (err) deferred.reject(err);
 
        if (place) {
            // return place
            deferred.resolve(place);
        } else {
            // place not found
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}
 
function create(placeParam) { // TODO:  CONTROLLER MUST PASS USER ID 
    var deferred = Q.defer();
 
    // validation
    db.places.findOne(
        { cityname: placeParam.cityname }, // TODO check for user ID with query - should only reject if this user has already been here
        function (err, place) {
            if (err) deferred.reject(err);
 
            if (place) {
                // cityname already exists in db
                deferred.reject(placeParam.cityname + '" is already in the database.');
            } else {
                createPlace();
            }
        });
 
    function createPlace() { // TODO: log user id to verify!
        var place = placeParam;

        db.places.insert(
            place,
            function (err, doc) {
                if (err) deferred.reject(err);
 
                deferred.resolve();
            });
    }
 
    return deferred.promise;
}
 
function update(_id, placeParam) {
    var deferred = Q.defer();
 
    // validation
    db.places.findById(_id, function (err, place) {
		updatePlace();
    });
 
    function updatePlace() {
        var set = {
            cityname: placeParam.cityName,
            //TODO: uid: placeParam.uid?
        };
 
        db.places.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);
 
                deferred.resolve();
            });
    }
 
    return deferred.promise;
}
 
// prefixed function name with underscore because 'delete' is a reserved word in javascript
function _delete(_id) {
    var deferred = Q.defer();
 
    db.places.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}