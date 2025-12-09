// Centered on Abu Dhabi
const map = L.map("map").setView([24.4539, 54.3773], 12);

// Basemap (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


let allGeojsonData = null;
let currentLayer = null;

// Styling points differently by Type
function getColor(type) {
  switch (type) {
    case "Park":
      return "green";
    case "Hospital":
      return "red";
    case "Library":
      return "blue";
    default:
      return "gray";
  }
}

// Converting GeoJSON points to circle markers
function pointToLayer(feature, latlng) {
  return L.circleMarker(latlng, {
    radius: 8,
    fillColor: getColor(feature.properties.Type),
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  });
}

// adding Popup with Name and Type
function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.Name) {
    layer.bindPopup(
      `<strong>${feature.properties.Name}</strong><br/>Type: ${feature.properties.Type}`
    );
  }
}

// Helper: add a given set of features to the map
function showFeatures(geojsonData) {
  // Remove old layer if present
  if (currentLayer) {
    map.removeLayer(currentLayer);
  }

  currentLayer = L.geoJSON(geojsonData, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  }).addTo(map);

  // Fit to bounds if we have any features
  try {
    const bounds = currentLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  } catch (e) {
    // Ignore if no bounds (e.g. no features)
  }
}

//  Loading GeoJSON from places.geojson
fetch("places.geojson")
  .then((response) => response.json())
  .then((geojsonData) => {
    allGeojsonData = geojsonData;
    // Initially show all features
    showFeatures(allGeojsonData);
  })
  .catch((err) => {
    console.error("Error loading GeoJSON:", err);
  });

/**
 * Interpret query like "show parks", "find hospitals"
 * and return a target Type string (Park / Hospital / Library)
 * or null if no match.
 */
function detectAmenityType(query) {
  const q = query.toLowerCase();

  if (q.includes("park") || q.includes("parks")) {
    return "Park";
  }
  if (q.includes("hospital") || q.includes("hospitals")) {
    return "Hospital";
  }
  if (q.includes("library") || q.includes("libraries")) {
    return "Library";
  }

  return null;
}

// Handling search button click
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value.trim();

  if (!allGeojsonData) return; // Data not loaded yet

  // If query is empty, show all
  if (!query) {
    showFeatures(allGeojsonData);
    return;
  }

  const amenityType = detectAmenityType(query);

  if (!amenityType) {
    // No recognizable type -> show all or an alert msg
    alert("Could not detect type from query. Showing all places.");
    showFeatures(allGeojsonData);
    return;
  }

  // Filter features by detected Type
  const filteredFeatures = allGeojsonData.features.filter(
    (f) =>
      f.properties &&
      f.properties.Type &&
      f.properties.Type.toLowerCase() === amenityType.toLowerCase()
  );

  const filteredGeojson = {
    type: "FeatureCollection",
    features: filteredFeatures
  };

  showFeatures(filteredGeojson);
});

//  allowing pressing Enter to trigger search
document
  .getElementById("search-input")
  .addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      document.getElementById("search-btn").click();
    }
  });
