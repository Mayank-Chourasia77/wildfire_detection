import tensorflow as tf
import numpy as np

def predict_image(model, image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(256, 256))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    prediction = model.predict(img_array)
    confidence = float(prediction[0])

    result = "Wildfire detected." if confidence > 0.5 else "No wildfire detected."
    return result, confidence * 100
