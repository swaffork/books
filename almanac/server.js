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
        } else if (!doc) {
            handleError(res, "Invalid document ID", "Failed to get place: invalid ID");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.put("/places/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;
    
    db.collection(PLACES_COLLECTION).findAndModify(
        { _id: new ObjectID(req.params.id) }, // Query
        [['_id', 'asc']], // Required sort order
        { $set: updateDoc }, // Update only changed fields
        { new: true }, // Return updated document as bson binary buffer
        function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update place");
        } else if (!doc["value"]) {
            handleError(res, "Invalid document ID", "Failed to update place: invalid ID");
        } else {
            // Send updated place
            res.status(200).json(doc);
        }
    });
});

app.delete("/places/:id", function (req, res) {
    db.collection(PLACES_COLLECTION).findAndModify(
        { _id: new ObjectID(req.params.id) }, // Query
        [['_id', 'asc']],
        {},
        { remove: true },
        function (err, doc) {
        if (err) {
            handleError(res, err.mesage, "Failed to delete place");
        } else if (!doc["value"]) {
            handleError(res, "Invalid document ID", "Failed to delete place: invalid ID");
        } else {
            // Send deleted place
            console.log(doc);
            res.status(200).json(doc);
        }
    });
});