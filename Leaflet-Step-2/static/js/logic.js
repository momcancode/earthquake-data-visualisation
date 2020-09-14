// CREATE BASE LAYERS
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-v9",
  accessToken: API_KEY
});

var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "outdoors-v11",
  accessToken: API_KEY
});

// Create a baseMaps object
var baseMaps = {
  "Satellite": satellite,
	"Grayscale": grayscale,
	"Outdoors": outdoors
};

// Store our API endpoints
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Define arrays to hold earthquake circle markers and tectonic plates boundaries
var earthquakeMarkers = [];
var tectonicLines = [];

// Grab the earthquake data with d3
d3.json(earthquakeUrl).then(function(data) {

	// Create function to color cicles according to earthquake magnitudes
	function getColor(d) {
    return d >= 5 ? "rgb(240, 107, 107)" :
           d >= 4 ? "rgb(240, 167, 107)" :
           d >= 3 ? "rgb(243, 186, 77)" :
					 d >= 2 ? "rgb(243, 219, 77)" :
					 d >= 1 ? "rgb(225, 243, 77)" :
					 					"rgb(183, 243, 77)";
	};
	
	// Grab the features data
	var features = data.features;

	for (var i = 0; i < features.length; i++) {
		
		//Define variable magnitudes and coordinates of the earthquakes
		var magnitudes = features[i].properties.mag;
		var coordinates = features[i].geometry.coordinates;

		// Add circles to map
		earthquakeMarkers.push(
			L.circle(
				[coordinates[1], coordinates[0]], {
					fillOpacity: 0.75,
					fillColor: getColor(magnitudes),
					color: getColor(magnitudes),
					stroke: false,
					radius: magnitudes * 17000
				}
			).addTo(myMap)
			.bindPopup("<h3>" + features[i].properties.place +
				"</h3><hr><p>" + new Date(features[i].properties.time) + 
				'<br>' + '[' + coordinates[1] + ', ' + coordinates[0] + ']' + "</p>"));
	};	

	// Legend for the chart
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function () {
	
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 1, 2, 3, 4, 5],
			labels = [];

		// loop through our magnitude intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' + getColor(grades[i]) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}
		return div;
	};
	legend.addTo(myMap);
});

// Create two separate layer groups: one for earthquakes and one for tectonic boundaries
var earthquake = L.layerGroup(earthquakeMarkers);
// var cities = L.layerGroup(cityMarkers);

// Create an overlay object
var overlayMaps = {
  "Earthquakes": earthquake,
  // "City Population": cities
};

// Define a map object
var myMap = L.map("map", {
	center: [23.6978, 120.9605],
	zoom: 4,
  layers: [satellite, earthquake] //this is in order of layering
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);