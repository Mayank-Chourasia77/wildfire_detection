
# Wildfire Detection System 🌲🔥

**WildFireAnalyzer** is an AI-powered image classification tool designed to detect wildfires from satellite or aerial images using **Convolutional Neural Networks (CNNs)** built with **TensorFlow**.

## 🚀 Demo

https://github.com/user-attachments/assets/82ba9dbd-3971-4a2e-8d75-e894aa96b97e


## Project Overview
A real-time wildfire monitoring system that:
- Detects active fires using NASA FIRMS satellite data
- Provides weather conditions for selected locations
- Displays satellite imagery of affected areas
- Includes machine learning for image analysis

## 🚀 Quick Start

```bash
#1. (Optional) Set Up a Virtual Environment
python -m venv venv

  #On Windows
   venv\Scripts\activate

  #On macOS/Linux
   source venv/bin/activate


# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the application
python app.py

# 4. Access in browser
# OR start http://localhost:5000
```
## 🔧 Key Features
- Real-time Fire Data from NASA FIRMS API
- Interactive Map with Leaflet.js
- Weather Integration via OpenWeatherMap
- Satellite Imagery from NASA Earth API
- Responsive Design works on desktop/mobile

## 🌐 API Configuration
Edit config.py with your keys:
```
# config.py

class Config:
 NASA_API_KEY = "your_nasa_key"          # From api.nasa.gov
 OPENWEATHER_API_KEY = "your_owm_key"    # From openweathermap.org
```
