class Config:
    # NASA FIRMS API
    NASA_API_KEY = "meBC7mUy7YNzI79QDSVhrggdDIcemSEuLdLBTRtd"
    NASA_FIRMS_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv/{api_key}/VIIRS_SNPP_NRT/world/1/{date}"
    
    # OpenWeather API
    OPENWEATHER_API_KEY = "06a209014e3aacd8a3e087054f9cb64c"
    OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
    
    # Map Configuration
    MAP_DEFAULT_ZOOM = 6
    MAP_DEFAULT_CENTER = [20.5937, 78.9629]  # Default to India coordinates