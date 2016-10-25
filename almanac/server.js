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
var PEOPLE_COLLECTION = "people";

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

// Generic error handler
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}
// PROBLEM IN USE PART???????
// Check client's content type is application/json
app.use('/', function (req, res, next) {
    var contentType = req.get('Content-Type');
    if (contentType != "application/json") {
        handleError(res, "request did not specify application/json Content-Type", "Header: failed to specify application/json Content-Type", 415);
    } else {
        // Set cache in header before sending response
        res.setHeader('Cache-Control', 'public, max-age=0');
        next();
    }
})

// Test server is up (GET http://ec2-54-70-44-156.us-west-2.compute.amazonaws.com:3000/)
// app.get(path, callback)
app.get('/', function (req, res) {
    res.send('Server is up!');
})

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
app.get("/places/:id", function (req, res, next) {
    db.collection(PLACES_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get place");
        } else if (!doc) {
            handleError(res, "Invalid document ID", "Failed to get place: invalid ID", 404);
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
            handleError(res, "Invalid document ID", "Failed to update place: invalid ID", 404);
        } else {
            // Send updated place
            res.status(200).json(doc.value);
        }
    });
});

app.delete("/places/:id", function (req, res) {
    // Update references to this place (set homeID to NULL)
    db.collection(PEOPLE_COLLECTION).update(
        { homeID: req.params.id }, // Query for people whose home this was
        { $set: { homeID: "NULL" } }, // Remove reference to this place
        { multi: true }, // Update all peope whose home this was
        function (err, result) {
            if (err) {
                handleError(res, "Could not update homeID reference", "Failed to delete place: could not update homeID reference", 404);
            }
            else {
                console.log('References in PEOPLE removed.'); // tbc: report how many people affected?
            }
    });

    // Delete place
    db.collection(PLACES_COLLECTION).findAndModify(
        { _id: new ObjectID(req.params.id) }, // Query
        [['_id', 'asc']],
        {},
        { remove: true },
        function (err, doc) {
        if (err) {
            handleError(res, err.mesage, "Failed to delete place");
        } else if (!doc["value"]) {
            handleError(res, "Invalid document ID", "Failed to delete place: invalid ID", 404);
        } else {
            // Send deleted place
            res.status(200).json(doc.value);
        }
    });
});

/* "/people" ------------------------------------------------------------------
 *  GET: finds all people
 *  POST: creates a new person
 */

app.get("/people", function (req, res) {
    db.collection(PEOPLE_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res.err.message, "Failed to get people.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/people", function (req, res) {
    var newPerson = req.body;
    if (!(req.body.name) ||
        !(req.body.occupation) ||
        !(req.body.alignment) ||
        !(req.body.trait) ||
        !(req.body.competency) ||
        !(req.body.homeID)) {
        handleError(res, "Invalid user input", "Must provide all people parameters.", 400);
    } else {
        // check that home is valid and in database
        db.collection(PLACES_COLLECTION).findOne({ _id: new ObjectID(req.body.homeID) }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new person: invalid place ID");
            } else if (!doc) {
                handleError(res, "Invalid document ID", "Failed to create new person: invalid place ID", 404);
            } else {
                // actually create the person!
                db.collection(PEOPLE_COLLECTION).insertOne(newPerson, function (err, doc) {
                    if (err) {
                        handleError(res, err.message, "Failed to create new person.");
                    } else {
                        // update place?
                        res.status(201).json(doc.ops[0]);
                    }
                });
            }
        });
    }
});

/* "/people/:id" --------------------------------------------------------------
 *  GET: find person by id
 *  PUT: update person by id
 *  DELETE: delete person by id
 */
app.get("/people/:id", function (req, res, next) {
    db.collection(PEOPLE_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get person");
        } else if (!doc) {
            handleError(res, "Invalid document ID", "Failed to get person: invalid ID", 404);
        } else {
            res.status(200).json(doc);
            next();
        }
    });
});

app.put("/people/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    // If changing character's home, check that new home is valid and in database
    if (updateDoc.homeID) {
        db.collection(PLACES_COLLECTION).findOne({ _id: new ObjectID(updateDoc.homeID) }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update person: invalid place ID");
            } else if (!doc) {
                handleError(res, "Invalid document ID", "Failed to update person: invalid place ID", 404);
            }
            else { // update the person with new home!
                db.collection(PEOPLE_COLLECTION).findAndModify(
                    { _id: new ObjectID(req.params.id) }, // Query
                    [['_id', 'asc']], // Required sort order
                    { $set: updateDoc }, // Update only changed fields
                    { new: true }, // Return updated document as bson binary buffer
                    function (err, doc) {
                        if (err) {
                            handleError(res, err.message, "Failed to update person");
                        } else if (!doc["value"]) {
                            handleError(res, "Invalid document ID", "Failed to update person: invalid ID", 404);
                        } else {
                            // Send updated person
                            res.status(200).json(doc.value);
                        }
                    });
            }
        });
    } else {
        db.collection(PEOPLE_COLLECTION).findAndModify(
            { _id: new ObjectID(req.params.id) }, // Query
            [['_id', 'asc']], // Required sort order
            { $set: updateDoc }, // Update only changed fields
            { new: true }, // Return updated document as bson binary buffer
            function (err, doc) {
                if (err) {
                    handleError(res, err.message, "Failed to update person");
                } else if (!doc["value"]) {
                    handleError(res, "Invalid document ID", "Failed to update person: invalid ID", 404);
                } else {
                    // Send updated person
                    res.status(200).json(doc.value);
                }
            });
    }
});

app.delete("/people/:id", function (req, res) {
    db.collection(PEOPLE_COLLECTION).findAndModify(
        { _id: new ObjectID(req.params.id) }, // Query
        [['_id', 'asc']],
        {},
        { remove: true },
        function (err, doc) {
            if (err) {
                handleError(res, err.mesage, "Failed to delete person");
            } else if (!doc["value"]) {
                handleError(res, "Invalid document ID", "Failed to delete person: invalid ID", 404);
            } else {
                // Send deleted person
                res.status(200).json(doc.value);
            }
        });
});