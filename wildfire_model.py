import os
import tensorflow as tf
from tensorflow import keras

ImageDataGenerator = tf.keras.preprocessing.image.ImageDataGenerator
layers = tf.keras.layers
models = tf.keras.models

# Function to check if the image is valid
def is_image_valid(file_path):
    try:
        with tf.keras.preprocessing.image.load_img(file_path) as img:
            img.verify()  # Verifies the image
        return True
    except (IOError, SyntaxError) as e:
        return False

# Function to clean up corrupted images from a directory
def clean_images(directory):
    for folder in os.listdir(directory):
        folder_path = os.path.join(directory, folder)
        if os.path.isdir(folder_path):
            for file in os.listdir(folder_path):
                file_path = os.path.join(folder_path, file)
                if not is_image_valid(file_path):
                    print(f"Removing corrupted image: {file_path}")
                    os.remove(file_path)

# Dataset paths
dataset_directory = "wildfire_dataset"  # Replace with your dataset path

# Clean the dataset by removing corrupted images
clean_images(os.path.join(dataset_directory, "Train"))
clean_images(os.path.join(dataset_directory, "Validation"))
clean_images(os.path.join(dataset_directory, "Test"))

# Define ImageDataGenerator
train_datagen = ImageDataGenerator(
    rescale=1./255, 
    validation_split=0.2  # 20% validation split
)

# Train, Validation, and Test generators
train_generator = train_datagen.flow_from_directory(
    os.path.join(dataset_directory, 'Train'),
    target_size=(256, 256),
    batch_size=32,
    class_mode='binary',  # Set to 'categorical' if more than 2 classes
    subset='training',  # Only for training data
)

validation_generator = train_datagen.flow_from_directory(
    os.path.join(dataset_directory, 'Validation'),
    target_size=(256, 256),
    batch_size=32,
    class_mode='binary',
    subset='validation',  # Only for validation data
)

test_datagen = ImageDataGenerator(rescale=1./255)
test_generator = test_datagen.flow_from_directory(
    os.path.join(dataset_directory, 'Test'),
    target_size=(256, 256),
    batch_size=32,
    class_mode='binary',
)

# Model architecture
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(256, 256, 3)),
    layers.MaxPooling2D(2, 2),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D(2, 2),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D(2, 2),
    layers.Flatten(),
    layers.Dense(512, activation='relu'),
    layers.Dense(1, activation='sigmoid')  # Binary classification (wildfire vs. no wildfire)
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Fit the model with the training and validation generators
history = model.fit(
    train_generator,
    epochs=10,
    validation_data=validation_generator,
    verbose=1
)

from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Optionally, evaluate the model on the test data
test_loss, test_acc = model.evaluate(test_generator, verbose=2)
print(f"Test accuracy: {test_acc}")

# Save the model
model.save("model/wildfire_detection_model.h5")
print("Model saved as 'wildfire_detection_model.h5'")
