from flask import Flask
import tensorflow as tf

app = Flask(__name__)

# Load model once during app startup
model_path = "model/wildfire_detection_model.h5"
model = tf.keras.models.load_model(model_path)

from app import routes  # Import routes after initializing the app
