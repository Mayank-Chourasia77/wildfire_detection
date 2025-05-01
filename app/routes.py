from flask import render_template, request, jsonify 
import os
import requests
from datetime import datetime, timedelta
from config import Config
from app import app, model
from app.utils import predict_image

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/realtime")
def realtime():
   return render_template("realtime.html", config=Config)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files or request.files["file"].filename == "":
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    upload_path = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(upload_path)

    result, confidence = predict_image(model, upload_path)
    os.remove(upload_path)

    return jsonify({
        "result": result,
        "confidence": f"{confidence:.2f}%"
    })

@app.route("/get_fire_data", methods=["POST"])
def get_fire_data():
    data = request.get_json()
    if not data or 'bounds' not in data:
        return jsonify({"error": "Invalid request"}), 400
    
    try:
        # Get yesterday's date for NASA API
        date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        url = Config.NASA_FIRMS_URL.format(
            api_key=Config.NASA_API_KEY,
            date=date
        )
        
        # Add bounding box parameters
        bounds = data['bounds']
        params = {
            'north': bounds['north'],
            'south': bounds['south'],
            'east': bounds['east'],
            'west': bounds['west']
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return jsonify({
            "data": response.text.split('\n')[1:],  # Skip header
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_weather", methods=["POST"])
def get_weather():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    
    if not lat or not lon:
        return jsonify({"error": "Missing coordinates"}), 400
    
    try:
        response = requests.get(
            f"{Config.OPENWEATHER_URL}?lat={lat}&lon={lon}&appid={Config.OPENWEATHER_API_KEY}&units=metric"
        )
        response.raise_for_status()
        weather_data = response.json()
        
        return jsonify({
            "temp": weather_data['main']['temp'],
            "humidity": weather_data['main']['humidity'],
            "wind_speed": weather_data['wind']['speed'],
            "conditions": weather_data['weather'][0]['description'],
            "icon": weather_data['weather'][0]['icon']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500