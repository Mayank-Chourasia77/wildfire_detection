import tensorflow as tf
import numpy as np

# Using the format you requested
models = tf.keras.models
preprocessing = tf.keras.preprocessing

# Load the trained model
model = models.load_model("model/wildfire_detection_model.h5")

# Function to make a prediction on an input image
def predict_wildfire():
    # Specify the file path of the image directly in the code (using raw string)
    image_path = r"C:\Users\Admin\Desktop\WildFire\wildfire_dataset\Test\wildfire\-60.6867,50.26079.jpg"  # Update with the correct image path
    
    # Load and preprocess the image
    img = preprocessing.image.load_img(image_path, target_size=(256, 256))
    img_array = preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    # Normalize the image (same as during model training)
    img_array = img_array / 255.0

    # Predict the class (0 = no wildfire, 1 = wildfire)
    prediction = model.predict(img_array)

    if prediction[0] > 0.5:
        print("This image contains wildfire.")
    else:
        print("This image does not contain wildfire.")

# Run the prediction function
predict_wildfire()
