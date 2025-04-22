# 🌲🔥 WildFireAnalyzer – Wildfire Detection with Deep Learning

**WildFireAnalyzer** is an AI-powered image classification tool designed to detect wildfires from satellite or aerial images using **Convolutional Neural Networks (CNNs)** built with **TensorFlow**.

---

## 🚀 How to Use

### 1. Clone the Repository

```git clone https://github.com/yourusername/wildfire_detection.git```
```cd wildfire_detection```

---

### 2. (Optional) Set Up a Virtual Environment
```python -m venv venv```

# On Windows
```venv\Scripts\activate```
# On macOS/Linux
```source venv/bin/activate```

---

### 3. Install Dependencies
```pip install -r requirements.txt```

---

### 📁 Make Sure Your Project Structure Looks Like This:
```
wildfire_detection/
├── wildfire_dataset/
│   ├── Test/
│   │   ├── nowildfire/
│   │   └── wildfire/
│   ├── Train/
│   │   ├── nowildfire/
│   │   └── wildfire/
│   └── Validation/
│       ├── nowildfire/
│       └── wildfire/
├── model/
│   └── wildfire_detection_model.h5
├── README.md
├── requirements.txt
├── testing_wildfire.py
└── wildfire_model.py
```
---

### 4. Train the Model ( NOT NEEDED )

```python wildfire_model.py```

---

### 5. Test with an Image

Edit the `image_path` inside `testing_wildfire.py` and run:

```python testing_wildfire.py```

---

## 📊 Dataset Used
The wildfire image dataset used in this project was sourced from Kaggle:

**Forest Fire Detection Using DL**  
🔗 [Kaggle Dataset Source](https://www.kaggle.com/code/codeml707/forest-fire-detection-using-dl/input)

The dataset is organized into `wildfire` and `nowildfire` classes under `Train`, `Validation`, and `Test` folders.



