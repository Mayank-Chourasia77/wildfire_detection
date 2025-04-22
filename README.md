# wildfire_detection
 
**WildFireAnalyzer** is an AI-powered image classification tool designed to detect wildfires from satellite or aerial images using Convolutional Neural Networks (CNNs) built with TensorFlow.



## 🚀 How to Use

### 1. Clone the repository


## Set up the environment (Optional)
Create and activate a virtual environment:
python -m venv venv
# On Windows
```venv\Scripts\activate```


## Install all dependencies:
bash
Copy
Edit
```
pip install -r requirements.txt
```



## Make sure the structure is like this
```wildfire_dataset/
├── Train/
│   ├── wildfire/
│   └── nowildfire/
├── Validation/
│   ├── wildfire/
│   └── nowildfire/
└── Test/
|   ├── wildfire/
|   └── nowildfire/
|
└── wildfire_model.py
└──testing_wildfire.py 
```


## Train the model
``` python wildfire_model.py ```

## Test an image
``` python testing_wildfire.py ```

##  Dataset used 

The wildfire image dataset used in this project was sourced from Kaggle:

**Forest Fire Detection Using DL**  
🔗 [Kaggle Dataset Source](https://www.kaggle.com/code/codeml707/forest-fire-detection-using-dl/input)

The dataset is organized into `wildfire` and `nowildfire` classes under `Train`, `Validation`, and `Test` folders.
