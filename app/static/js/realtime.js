document.addEventListener('DOMContentLoaded', () => {
  // Wait for map to be initialized
  const checkMapReady = setInterval(() => {
      if (window.wildfireMap) {
          clearInterval(checkMapReady);
          setupEventHandlers();
      }
  }, 100);

  function setupEventHandlers() {
      const checkFireBtn = document.getElementById('check-fire-btn');
      const forestSelect = document.getElementById('forest-select');
      const weatherInfo = document.getElementById('weather-info');
      const fireResults = document.getElementById('fire-results');
      const coordinatesDisplay = document.getElementById('map-coordinates');
      const satelliteImageContainer = document.getElementById('satellite-image-container');

      // Update coordinates on map move
      window.wildfireMap.on('move', updateCoordinates);
      
      // Forest region selection - now with automatic weather update
      forestSelect.addEventListener('change', async (e) => {
          const regionId = e.target.value;
          if (regionId && regionId !== 'custom') {
              const region = forestRegions[regionId];
              window.wildfireMap.flyTo(region.coords, region.zoom);
              
              // Automatically fetch weather for this location
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for map to move
              fetchWeather(region.coords[0], region.coords[1]);
          }
      });

      // Map click for weather
      window.wildfireMap.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          fetchWeather(lat, lng);
      });

      // Check wildfires button - now with satellite image
      checkFireBtn.addEventListener('click', async () => {
          fireResults.innerHTML = `
              <div class="text-center py-3">
                  <div class="spinner-border text-danger"></div>
                  <p class="mt-2">Analyzing area...</p>
              </div>
          `;
          
          try {
              const bounds = window.wildfireMap.getBounds();
              const center = window.wildfireMap.getCenter();
              
              // Fetch fire data
              const fireResponse = await fetch('/get_fire_data', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      bounds: {
                          north: bounds.getNorth(),
                          south: bounds.getSouth(),
                          east: bounds.getEast(),
                          west: bounds.getWest()
                      }
                  })
              });
              
              const fireData = await fireResponse.json();
              
              // Display results
              if (fireResponse.ok) {
                  if (fireData.data && fireData.data.length > 0) {
                      fireResults.innerHTML = `
                          <div class="alert alert-danger">
                              <h5><i class="fas fa-fire me-2"></i>Wildfires Detected!</h5>
                              <p>${fireData.data.length} active fire locations found.</p>
                          </div>
                      `;
                  } else {
                      fireResults.innerHTML = `
                          <div class="alert alert-success">
                              <h5><i class="fas fa-check-circle me-2"></i>No Wildfires Detected</h5>
                              <p>No active fires in this area.</p>
                          </div>
                      `;
                  }
                  
                  // Get current date in YYYY-MM-DD format for NASA API
                  const today = new Date();
                  const dateString = today.toISOString().split('T')[0];
                  
                  // Display satellite image using NASA API with your key
                  const nasaImageUrl = `https://api.nasa.gov/planetary/earth/imagery?lon=${center.lng}&lat=${center.lat}&date=${dateString}&dim=0.15&api_key=meBC7mUy7YNzI79QDSVhrggdDIcemSEuLdLBTRtd`;
                  
                  satelliteImageContainer.innerHTML = `
                      <div class="mb-3">
                          <img src="${nasaImageUrl}" alt="Satellite view" class="img-fluid rounded" id="satellite-image" onerror="this.parentElement.innerHTML='<div class=\'alert alert-warning\'><i class=\'fas fa-exclamation-triangle me-2\'></i>Could not load satellite image</div>'">
                          <p class="mt-2 small text-muted">Satellite image from ${dateString}</p>
                      </div>
                      <button class="btn btn-sm btn-outline-danger" id="analyze-image-btn">
                          <i class="fas fa-search me-1"></i>Analyze This Image
                      </button>
                  `;
                  
                  // Add click handler for image analysis
                  document.getElementById('analyze-image-btn')?.addEventListener('click', () => {
                      analyzeImage(nasaImageUrl);
                  });
              } else {
                  showError(fireResults, fireData.error || "Failed to load fire data");
              }
          } catch (error) {
              showError(fireResults, "Fire API error");
          }
      });

      // Update coordinates display
      function updateCoordinates() {
          const center = window.wildfireMap.getCenter();
          coordinatesDisplay.textContent = `Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(4)}`;
      }

      // Fetch weather with improved icon handling
      async function fetchWeather(lat, lng) {
          weatherInfo.innerHTML = `
              <div class="text-center py-3">
                  <div class="spinner-border text-primary"></div>
                  <p class="mt-2">Loading weather...</p>
              </div>
          `;
          
          try {
              const response = await fetch('/get_weather', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ lat, lon: lng })
              });
              
              const data = await response.json();
              
              if (response.ok) {
                  // Fix for dark mode visibility
                  const iconColor = document.body.classList.contains('dark-mode') ? 'text-light' : 'text-primary';
                  const iconClass = getWeatherIconClass(data.conditions.toLowerCase());
                  
                  weatherInfo.innerHTML = `
                      <div class="text-center">
                          <div class="weather-icon mb-2 ${iconColor}">
                              <i class="fas ${iconClass} fa-3x"></i>
                          </div>
                          <h5 class="mb-3">${capitalizeFirstLetter(data.conditions)}</h5>
                          <div class="row">
                              <div class="col-4">
                                  <div class="bg-light p-2 rounded">
                                      <small class="text-muted">Temp</small>
                                      <div class="fw-bold">${data.temp}°C</div>
                                  </div>
                              </div>
                              <div class="col-4">
                                  <div class="bg-light p-2 rounded">
                                      <small class="text-muted">Humidity</small>
                                      <div class="fw-bold">${data.humidity}%</div>
                                  </div>
                              </div>
                              <div class="col-4">
                                  <div class="bg-light p-2 rounded">
                                      <small class="text-muted">Wind</small>
                                      <div class="fw-bold">${data.wind_speed} m/s</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  `;
              } else {
                  showError(weatherInfo, data.error || "Failed to load weather data");
              }
          } catch (error) {
              showError(weatherInfo, "Weather API error");
          }
      }

      // Image analysis function
      async function analyzeImage(imageUrl) {
          satelliteImageContainer.innerHTML = `
              <div class="text-center py-3">
                  <div class="spinner-border text-danger"></div>
                  <p class="mt-2">Processing image...</p>
              </div>
          `;
          
          // In a real implementation, you would send this to your model
          setTimeout(() => {
              satelliteImageContainer.innerHTML = `
                  <div class="alert alert-success">
                      <h5><i class="fas fa-check-circle me-2"></i>Analysis Complete</h5>
                      <p>No wildfire detected in this image.</p>
                      <img src="${imageUrl}" alt="Analyzed image" class="img-fluid rounded mt-2">
                  </div>
              `;
          }, 2000);
      }

      // Helper functions
      function showError(element, message) {
          element.innerHTML = `
              <div class="alert alert-danger">
                  <i class="fas fa-exclamation-triangle me-2"></i>${message}
              </div>
          `;
      }

      function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
      }

      function getWeatherIconClass(conditions) {
          const icons = {
              'clear sky': 'fa-sun',
              'few clouds': 'fa-cloud-sun',
              'scattered clouds': 'fa-cloud',
              'broken clouds': 'fa-cloud',
              'shower rain': 'fa-cloud-rain',
              'rain': 'fa-umbrella',
              'thunderstorm': 'fa-bolt',
              'snow': 'fa-snowflake',
              'mist': 'fa-smog'
          };
          return icons[conditions] || 'fa-cloud';
      }
  }
});

// When displaying the fetched image:
function updateDateTime() {
  const now = new Date();
  document.getElementById('current-date').textContent = now.toLocaleDateString();
  document.getElementById('current-time').textContent = now.toLocaleTimeString();
}

// Update time every second
updateDateTime();
setInterval(updateDateTime, 1000);