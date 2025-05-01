// Map configuration
const MAP_CONFIG = {
  DEFAULT_CENTER: [20.5937, 78.9629],
  DEFAULT_ZOOM: 6
};

// Store last clicked location
let lastClickedLocation = MAP_CONFIG.DEFAULT_CENTER;
let currentMarker = null;

// Initialize the map
function initMap() {
  const map = L.map('map').setView(MAP_CONFIG.DEFAULT_CENTER, MAP_CONFIG.DEFAULT_ZOOM);
  
  // Base layers
  const baseLayers = {
      "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
      }),
      "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 19
      })
  };
  
  // Add default layer
  baseLayers["Street Map"].addTo(map);
  
  // Add click handler to update last clicked location
  map.on('click', function(e) {
    lastClickedLocation = e.latlng;
    
    // Update coordinates display
    document.getElementById('map-coordinates').textContent = 
      `Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`;
    
    // Add/update marker
    if (currentMarker) {
      currentMarker.setLatLng(e.latlng);
    } else {
      currentMarker = L.marker(e.latlng).addTo(map);
    }
  });
  
  // Add layer control
  L.control.layers(baseLayers, null, {position: 'topright'}).addTo(map);
  
  return map;
}

// Forest regions data
const forestRegions = {
  amazon: { coords: [-3.4653, -62.2159], zoom: 5 },
  borneo: { coords: [0.9619, 114.5548], zoom: 6 },
  congo: { coords: [-0.3177, 15.3082], zoom: 5 },
  western_ghats: { coords: [10.1670, 76.7942], zoom: 7 },
  sundarbans: { coords: [21.9497, 89.1833], zoom: 9 }
};

// Initialize map when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  window.wildfireMap = initMap();
  window.lastClickedLocation = lastClickedLocation; // Make it globally accessible
  console.log("Map initialized successfully");
});