from flask import render_template, request, jsonify 
import os
from app import app, model
from app.utils import predict_image

@app.route("/")
def home():
    return render_template("index.html")

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
# app/routes.py

