// controls access to angular app files using a session/cookie authentication
// exposes JWT token to be used by angular app to make authenticated api requests

var express = require('express');
var router = express.Router();
 
// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
    }
 
    next();
});
 
// make JWT token available to angular app - made available by login controller and stored in user session
router.get('/token', function (req, res) {
    res.send(req.session.token);
});
 
// serve angular app files from the '/app' route
router.use('/', express.static('app'));
 
module.exports = router;