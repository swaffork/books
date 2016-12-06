function geoFindMe() {
    var output = document.getElementById("out");
	output.innerHTML = '<p>Latitude is </p>';
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "http://ip-api.com/json", true);
	xhr.send();
	
	xhr.addEventListener("readystatechange", processRequest, false);
	
	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			console.log(response.city);	
			var city = response.city;
			var latitude = response.lat;
			var longitude = response.lon;
			
			output.innerHTML = '<p>City: ' + city + '<br>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    		/*var img = new Image();
    		img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    		output.appendChild(img); */
		}
	}
}
