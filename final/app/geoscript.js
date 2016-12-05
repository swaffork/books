var request = require('request');

function geoFindMe() {
    var output = document.getElementById("out");

	request('http://ip-api.com/json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body.city);
		output.innerHTML = '<p>Latitude is ' + body.lat + '° <br>Longitude is ' + body.lon + '°</p>';
    }
});