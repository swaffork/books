// places api

var config = require('config.json');
var express = require('express');
var router = express.Router();
var placeService = require('services/place.service');
 
// routes
router.post('/add', addPlace);
router.get('/current', getCurrentPlace);
router.put('/:_id', updatePlace);
router.delete('/:_id', deletePlace);
 
module.exports = router;
 
function addPlace(req, res) {
    placeService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function getCurrentPlace(req, res) {
    placeService.getById(req.place.id) // TODO: which field is appropriate here? how send id in request?
        .then(function (place) {
            if (place) {
                res.send(place);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function updatePlace(req, res) {
    var placeId = req.place.id;
 
    placeService.update(placeId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
 
function deletePlace(req, res) {
    var placeId = req.place.id;
 
    placeService.delete(placeId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}