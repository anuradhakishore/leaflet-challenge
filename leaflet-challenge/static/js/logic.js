// URL for earthquake data
const earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Function to create markers for each earthquake feature
function createMarkers(features) {
    // Create marker for each feature
    function createMarker(feature, latlng) {
        // Define marker properties
        return L.circleMarker(latlng, {
            radius: calculateMarkerSize(feature.properties.mag),
            fillColor: getColorByDepth(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: 1
        });
    }

    // Function to run for each feature
    function onEachFeature(feature, layer) {
        // Bind popup with earthquake information
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3>Magnitude:</h3> ${feature.properties.mag}<h3>Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    // Create GeoJSON layer
    const earthquakesLayer = L.geoJSON(features, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    // Call function to create map
    createMap(earthquakesLayer);
}

// Function to create the map
function createMap(earthquakesLayer) {
    // Base layer for the map
    const streetTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the map
    const map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetTileLayer, earthquakesLayer]
    });

    // Create legend for earthquake magnitudes
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [-10, 10, 30, 50, 70, 90];
        const labels = [];
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorByDepth(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add legend to map
    legend.addTo(map);
}

// Function to calculate marker size based on earthquake magnitude
function calculateMarkerSize(magnitude) {
    return magnitude * 5;
}



// Function to get color based on earthquake depth
function getColorByDepth(depth) {
    switch (true) {
        case depth > 90:
            return '#FF3349';
        case depth > 70:
            return '#FF33A8';
        case depth > 50:
            return '#33B5FF';
        case depth > 30:
            return '#FF8033';
        case depth > 10:
            return '#ECFF33';
        default:
            return '#86FF33';
    }
}

// Fetch earthquake data
d3.json(earthquakeDataUrl).then(function(earthquakeData) {
    // Call function to create markers
    createMarkers(earthquakeData.features);
});

