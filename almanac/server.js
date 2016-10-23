/* Dungeon World Almanac API
 * By Kendra Swafford
 * With help from:
 * http://thejackalofjavascript.com/nodejs-restify-mongolab-build-rest-api/
 * https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
 * http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/
 */

// Sever setup! ---------------------------------------------------------------
var express = require('express');
var server = express();
var bodyParser = require('body-parser');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
var port = process.env.PORT || 3000;

// Database setup! ------------------------------------------------------------
// mongodb://<dbuser>:<dbpassword>@ds063546.mlab.com:63546/almanac
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:hasswa@ds063546.mlab.com:63546/almanac');
var Place = require('./models/place');

// Routes! --------------------------------------------------------------------
var router = express.Router(); // all routes defined and applied to root URL /almanac

// Middleware to use for all requests
// TBC: validate req, throw error if something wrong
router.use(function (req, res, next) {
    console.log('Request coming in...');
    next();
});

// Test route to makes sure server is up (GET http://localhost:3000/almanac)
router.get('/', function (req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.send('Server is up!');
    return next();
});

// /almanac/places routes -------------
router.route('/places')
    // Get all the places (GET http://localhost:3000/almanac/places)
    .get(function (req, res) {
        Place.find(function (err, places) {
            if (err)
                res.send(err);

            res.json(places);
        });
    })

    // Create a new place (POST http://localhost:3000/almanac/places)
    .post(function (req, res) {
        console.log('POST almanac/places');
        var place = new Place(); // new instance of Place model
        place.name = req.body.name;
        console.log(place.name);

        // If no errors, save the place
        place.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Place created!' });
        });
    });

/* ----- /place/id GET endpoint 
Effect: view a single place
req.params.name = name of place

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
}); */

/* ----- /places POST endpoint -----
Effect: add a new place to almanac.
req.params = place object send by client 
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
}); */

/* ----- /place PUT endpoint -----
Effect: update existing place
req.params.name = name of the place to update
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
}); */

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

// Register routes and run server
server.use('/almanac', router);
server.listen(port);
console.log('Server listening on ' + port);