/* Dungeon World Almanac API
 * By Kendra Swafford
 * With help from:
 * http://thejackalofjavascript.com/nodejs-restify-mongolab-build-rest-api/
 * https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
 */

// Setup!
var express = require('express');
var server = express();
var bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
var port = process.env.PORT || 3000;

// Connect to MongoDB with standard URI:
// mongodb://<dbuser>:<dbpassword>@ds063546.mlab.com:63546/almanac, ['<collection>']
//var db = mongojs('mongodb://admin:hasswa@ds063546.mlab.com:63546/almanac', ['entries']);

/* ----- /places GET endpoint -----
Effect: view all the places in the almanac.
req = all data from client
res = all data server sends to client
next = used to invoke next middleware method in queue */
server.get('/places', function (req, res, next) {
    console.log('In places GET');
    res.json({ message: 'wow it works again!' });
});

/* ----- /place/id GET endpoint 
Effect: view a single place
req.params.name = name of place
*/
server.get('/place/:name', function (req, res, next) {
    console.log('In place/name GET')
    db.entries.findOne({
        name: req.params.name
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

/* ----- /places POST endpoint -----
Effect: add a new place to almanac.
req.params = place object send by client */
server.post('/places', function (req, res, next) {
    console.log('In places POST');
    var place = req.params;
    db.entries.save(place,
        function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

/* ----- /place PUT endpoint -----
Effect: update existing place
req.params.name = name of the place to update
*/
server.put('/place/:name', function (req, res, next) {
    // get existing place
    db.entries.findOne({
        name: req.params.name
    }, function (err, data) {
        // Server isn't aware of changes;
        // merge req.params/place with existing server/place
        var updPlace = {};
        for (var i in data) {
            updPlace[i] = data[i];
        }
        for (var i in req.params) {
            updPlace[i] = req.params[i];
        }
        db.entries.update({
            name: req.params.name
        }, updPlace, {
            multi: false
        }, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(data));
        });
    });
    return next();
});

/* ----- /place DELETE endpoint -----
Effect: remove a place from almanac
server.del('product/:name', function (req, res, next) {
    console.log('In place DELETE');
    db.entries.remove({
        name: req.params.name
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(true));
    });
    return next();
});
*/

// Run server
server.listen(port, function () {
    console.log('Server listening on ' + port);
});
