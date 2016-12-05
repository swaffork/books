function geoFindMe() {
    var output = document.getElementById("out");
	output.innerHTML = '<p>Latitude is </p>';
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "//ipinfo.io/json", true);
	xhr.send();
	
	xhr.addEventListener("readystatechange", processRequest, false);
	
	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			alert(response.ip);
		}
	}
}