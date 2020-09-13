// Create map object
var myMap = L.map("map", {
	center: [37.09, -95.71],
	zoom: 5
});
  
// Adding light mode tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	tileSize: 512,
	maxZoom: 18,
	zoomOffset: -1,
	id: "light-v10",
	accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(queryUrl).then(function(data) {
	
	// Grab the features data
	var features = data.features;

	for (var i = 0; i < features.length; i++) {
		
		//Define variable magnitudes of the earthquakes
		var magnitudes = features[i].properties.mag;

		// Conditionals for magnitudes of the earthquakes
		if (magnitudes >= 5) {
			circleColor = "rgb(240, 107, 107)";
			}
			else if (magnitudes >= 4) {
			circleColor = "rgb(240, 167, 107)";
			}
			else if (magnitudes >= 3) {
			circleColor = "rgb(243, 186, 77)";
			}
			else if (magnitudes >= 2) {
			circleColor = "rgb(243, 219, 77)";
			}
			else if (magnitudes >= 1) {
			circleColor = "rgb(225, 243, 77)";
			}
			else {
			circleColor = "rgb(183, 243, 77)";
			}
}
});
