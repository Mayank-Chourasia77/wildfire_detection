from flask import Flask, request, render_template, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model("model/wildfire_detection_model.h5")

# Function to preprocess and predict wildfire
def predict_wildfire(image_path):
    # Load and preprocess the image
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(256, 256))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Normalize the image

    # Predict the class (0 = no wildfire, 1 = wildfire)
    prediction = model.predict(img_array)

    return "Wildfire detected." if prediction[0] > 0.5 else "No wildfire detected."

# Route for the home page
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

# Route for the about us page
@app.route("/about", methods=["GET"])
def about():
    return render_template("about.html")

# Route for the contact us page
@app.route("/contact", methods=["GET"])
def contact():
    return render_template("contact.html")

# Route to handle image uploads and predictions
@app.route("/predict", methods=["POST"])
def predict():
    # Check if an image file was uploaded
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Save the uploaded file temporarily
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    upload_folder = "uploads"
    os.makedirs(upload_folder, exist_ok=True)  # Create the uploads folder if it doesn't exist
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)

    # Make prediction
    img = tf.keras.preprocessing.image.load_img(file_path, target_size=(256, 256))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    prediction = model.predict(img_array)
    confidence = float(prediction[0]) * 100

    result = {
        "result": "Wildfire detected." if prediction[0] > 0.5 else "No wildfire detected.",
        "confidence": f"{confidence:.2f}%"
    }

    # Clean up the uploaded file
    os.remove(file_path)

    # Return the prediction result
    return jsonify({"result": result})

    
# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)