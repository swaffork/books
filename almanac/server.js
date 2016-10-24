/* Dungeon World Almanac API
 * By Kendra Swafford
 * With help from:
 * http://thejackalofjavascript.com/nodejs-restify-mongolab-build-rest-api/
 * https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
 * https://devcenter.heroku.com/articles/mean-apps-restful-api
 */

// Sever setup! ---------------------------------------------------------------
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var PLACES_COLLECTION = "places";

var app = express();
app.use(bodyParser.json());

// Database setup! ------------------------------------------------------------
var db;
mongodb.MongoClient.connect('mongodb://admin:hasswa@ds063546.mlab.com:63546/almanac', function(err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save db from callback for reuse!
    db = database;
    console.log("Database is ready to go!");

    // Init the server
    var server = app.listen(process.env.PORT || 3000, function () {
        var port = server.address().port;
        console.log("Server listening on " + port);
    });
});

// Test server is up (GET http://ec2-54-70-44-156.us-west-2.compute.amazonaws.com:3000/)
// app.get(path, callback)
app.get('/', function(req, res) {
    res.send('Server is up!');
})

// Generic error handler
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

/* "/places" ------------------------------------------------------------------
 *  GET: finds all places
 *  POST: creates a new place
 */

app.get("/places", function (req, res) {
    db.collection(PLACES_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res.err.message, "Failed to get places.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/places", function (req, res) {
    var newPlace = req.body;
    if (!(req.body.name) ||
        !(req.body.type) ||
        !(req.body.climate) ||
        !(req.body.terrain) ||
        !(req.body.danger) ||
        !(req.body.alignment)) {
        handleError(res, "Invalid user input", "Must provide all place parameters.", 400);
    } else {
        db.collection(PLACES_COLLECTION).insertOne(newPlace, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new place.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }});

/* "/places/:id" --------------------------------------------------------------
 *  GET: find place by id
 *  PUT: update place by id
 *  DELETE: delete place by id
 */
app.get("/places/:id", function (req, res) {
    db.collection(PLACES_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get place");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.put("/places/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(PLACES_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function(err, doc) {
        if (err) {
            handleErrr(res, err.message, "Failed to update place");
        } else {
            res.status(204).end();
        }
    });
});

app.delete("/places/:id", function (req, res) {
    db.collection(PLACES_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.mesage, "Failed to delete place");
        } else {
            res.status(204).end();
        }
    });
});

/*
// Test route to makes sure server is up (GET http://localhost:3000/)
server.get('/', function (req, res, next) {
	console.log("GET '/'");
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end('Server is up!');
    return next();
});

// Get all the places (GET http://localhost:3000/places)
server.get('places', function (req, res, next) {
    console.log("GET /places");
    db.places.find(function (err, places) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(places));
    });
    return next();
});

// Get a single place (GET http://localhost:3000/place/<id>)
server.get('/place/:_id', function (req, res, next) {
    console.log('GET /place/' + req.params._id);
    db.places.findOne({
        _id: ObjectID.createFromHexString(req.params._id)
    }, function (err, data) {
        console.log(JSON.stringify(data));
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

// Create a new place (POST http://localhost:3000/places)
server.post('/places', function (req, res, next) {
    console.log('POST /places');
    var place = req.body;
    db.places.save(place,
        function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

// Update existing place (PUT http://localhost:3000/put/<name>)
/* ----- /place PUT endpoint -----
Effect: update existing place
req.body.name = name of the place to update
server.put('/place/:name', function (req, res, next) {
    console.log('PUT /place/' + req.params.name);
    // get existing place
    db.places.findOne({
        name: req.params.name
    }, function (err, data) {
        // Server isn't aware of changes;
        // merge req.params/place with existing server/place
        var updPlace = {};
        for (var i in data) {
            updPlace[i] = data[i];
        }
        for (var i in req.body) {
            updPlace[i] = req.body[i];
        }
        db.places.update({
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

/* USING EXPRESS ROUTER AND MONGOOSE:
/almanac/places routes -------------
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
    }); */