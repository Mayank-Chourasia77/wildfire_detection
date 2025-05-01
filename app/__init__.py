from flask import Flask
import tensorflow as tf

app = Flask(__name__)

# Global model variable
model = None

try:
    model = tf.keras.models.load_model("model/wildfire_detection_model.h5")
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Model loading failed: {str(e)}")

from app import routes