import os
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from train_datasets import train_model
import shap
import os
import shutil
import kagglehub

MODEL_FOLDER = "models"
MODEL_PATH = os.path.join(MODEL_FOLDER, "rf_model.pkl")
SCALER_PATH = os.path.join(MODEL_FOLDER, "scaler.pkl")
ACCURACY_PATH = os.path.join(MODEL_FOLDER, "accuracy.pkl")
DATASET_PATH = "Datasets/cardio_train.csv"

if not os.path.exists(DATASET_PATH):
    print("📦 Dataset not found locally. Downloading from Kaggle...")
    try:
        path = kagglehub.dataset_download("sulianova/cardiovascular-disease-dataset")
        print("✅ Dataset downloaded to:", path)

        dest_dir = os.path.join(os.getcwd(), "Datasets")
        os.makedirs(dest_dir, exist_ok=True)

        shutil.copytree(path, dest_dir, dirs_exist_ok=True)
        print("📂 Dataset moved to:", dest_dir)
    except Exception as e:
        raise RuntimeError(f"❌ Failed to download dataset: {e}")

if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH) and os.path.exists(ACCURACY_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    accuracy = joblib.load(ACCURACY_PATH)
else:
    model, scaler, accuracy = train_model(DATASET_PATH)

TRAINING_FEATURES = [
    'gender', 'height', 'weight', 'ap_hi', 'ap_lo',
    'cholesterol', 'gluc', 'smoke', 'alco', 'active',
    'bmi', 'pulse_pressure', 'age_years'
]

# ----------------------------
# Load or train model
# ----------------------------
if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH) and os.path.exists(ACCURACY_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    accuracy = joblib.load(ACCURACY_PATH)
else:
    # NOTE: This assumes 'train_model' is correctly defined in 'train_datasets.py'
    # and handles saving the model artifacts.
    model, scaler, accuracy = train_model(DATASET_PATH)

# ----------------------------
# FastAPI setup
# ----------------------------
app = FastAPI(title="Cardio Risk Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"✅ Model ready | Accuracy: {accuracy:.4f}")

# ----------------------------
# Input schema
# ----------------------------
class UserInput(BaseModel):
    age: float
    gender: int
    height: float
    weight: float
    ap_hi: int
    ap_lo: int
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int

# ----------------------------
# SHAP Explainer
# ----------------------------
explainer = shap.TreeExplainer(model)

# ----------------------------
# Predict Route
# ----------------------------
@app.post("/predict")
def predict(data: UserInput):
    df = pd.DataFrame([data.dict()])

    # Feature engineering
    df["bmi"] = df["weight"] / ((df["height"] / 100) ** 2)
    df["pulse_pressure"] = df["ap_hi"] - df["ap_lo"]
    df['age_years'] = df["age"]
    df = df.drop("age", axis=1)

    # Scale features
    df_scaled = scaler.transform(df[TRAINING_FEATURES])

    # Prediction
    prob = model.predict_proba(df_scaled)[0][1]

    # Risk classification
    if prob < 0.33:
        risk = "Low"
    elif prob < 0.66:
        risk = "Medium"
    else:
        risk = "High"

    # ----------------------------
    # SHAP explanation - FIXED LOGIC
    # ----------------------------
    shap_values = explainer.shap_values(df_scaled)
    
    # 1. Extract the raw SHAP array for the positive class (risk=1)
    if isinstance(shap_values, list):
        # Binary classification model: get positive class (index 1), first sample [0]
        raw_shap_array = shap_values[1][0]
    else:
        # Regression or single-output model: get first sample [0]
        raw_shap_array = shap_values[0] 

    # 2. Enforce 1-dimensional shape (13,) to resolve ValueError (13, 2)
    if raw_shap_array.ndim > 1:
        # Check for the problematic (13, 2) shape and select the first column
        if raw_shap_array.shape == (len(TRAINING_FEATURES), 2):
            shap_array = raw_shap_array[:, 0]
        else:
            # Fallback to general flattening for other unexpected 2D shapes
            shap_array = raw_shap_array.flatten()
    else:
        # If it's already 1-dimensional, use it directly
        shap_array = raw_shap_array

    # 3. Create the Series using the now 1D 'shap_array'
    shap_series = pd.Series(shap_array, index=TRAINING_FEATURES)

    # ----------------------------
    # Friendly mappings
    # ----------------------------
    rename_map = {
        "ap_hi": "Systolic BP",
        "ap_lo": "Diastolic BP",
        "bmi": "Body Mass Index",
        "age_years": "Age",
        "cholesterol": "Cholesterol",
        "gluc": "Glucose",
        "pulse_pressure": "Pulse Pressure",
        "smoke": "Smoking",
        "alco": "Alcohol Intake",
        "active": "Physical Activity"
    }

    reason_texts = {
        "Systolic BP": "High blood pressure increases strain on the heart.",
        "Diastolic BP": "Low diastolic pressure reduces blood flow efficiency.",
        "Body Mass Index": "Higher BMI is linked to obesity and heart issues.",
        "Cholesterol": "High cholesterol can clog arteries.",
        "Glucose": "High glucose levels indicate possible diabetes risk.",
        "Pulse Pressure": "Large pulse pressure suggests arterial stiffness.",
        "Smoking": "Smoking damages blood vessels and heart tissue.",
        "Alcohol Intake": "Frequent alcohol intake affects blood pressure.",
        "Physical Activity": "Being active protects heart health."
    }

    friendly_map = {
        "Gender": {1: "Male", 2: "Female"},
        "Cholesterol": {1: "Normal", 2: "Above Normal", 3: "Well Above Normal"},
        "Glucose": {1: "Normal", 2: "Above Normal", 3: "Well Above Normal"},
        "Smoking": {0: "No", 1: "Yes"},
        "Alcohol Intake": {0: "No", 1: "Yes"},
        "Physical Activity": {0: "No", 1: "Yes"}
    }

    healthy_factors = []
    unhealthy_factors = []

    for feature in shap_series.index:
        friendly_name = rename_map.get(feature, feature)
        if friendly_name.lower() in ["gender", "age", "height", "weight"]: # Added 'weight' to skip
            continue

        value = df[feature].values[0]
        
        # Check based on SHAP value (if the feature is a continuous/coded numerical feature)
        # Note: Added 'weight' to skip above, so using just `feature` is fine here
        if friendly_name in ["Smoking", "Alcohol Intake"]:
            if value == 1:
                unhealthy_factors.append({"factor": friendly_name, "description": reason_texts.get(friendly_name, "")})
            else:
                healthy_factors.append({"factor": friendly_name, "description": f"{friendly_name} is in a healthy range"})
        elif friendly_name == "Physical Activity":
            if value == 1:
                healthy_factors.append({"factor": friendly_name, "description": reason_texts.get(friendly_name, "")})
            else:
                unhealthy_factors.append({"factor": friendly_name, "description": reason_texts.get(friendly_name, "")})
        else:
            # Logic based on SHAP contribution: > 0 means it pushed the prediction toward risk (unhealthy)
            if shap_series[feature] > 0:
                unhealthy_factors.append({"factor": friendly_name, "description": reason_texts.get(friendly_name, "")})
            else:
                healthy_factors.append({"factor": friendly_name, "description": f"{friendly_name} is in a healthy range"})

    personal_info = {
        "Age": int(df["age_years"][0]),
        "Gender": friendly_map["Gender"].get(data.gender, data.gender),
        "Height (cm)": float(df["height"][0]),
        "Weight (kg)": float(df["weight"][0]),
    }

    calculated_info = {
        "BMI": float(round(df["bmi"][0], 2)),
        "Pulse Pressure": float(round(df["pulse_pressure"][0], 2)),
        "Systolic BP": int(df["ap_hi"][0]),
        "Diastolic BP": int(df["ap_lo"][0]),
        "Cholesterol": friendly_map["Cholesterol"].get(data.cholesterol, data.cholesterol),
        "Glucose": friendly_map["Glucose"].get(data.gluc, data.gluc),
        "Smoking": friendly_map["Smoking"].get(data.smoke, data.smoke),
        "Alcohol Intake": friendly_map["Alcohol Intake"].get(data.alco, data.alco),
        "Physical Activity": friendly_map["Physical Activity"].get(data.active, data.active),
    }

    return {
        "probability": round(float(prob), 2),
        "risk_level": risk,
        "model_accuracy": round(float(accuracy * 100), 2),
        "healthy_factors": healthy_factors,
        "unhealthy_factors": unhealthy_factors,
        "inputs": data.dict(),
        "personal_info": personal_info,
        "calculated_info": calculated_info
    }

# ----------------------------
# Root Endpoint
# ----------------------------
@app.get("/")
def root():
    return {
        "message": "Cardio Risk Prediction API is running 🚀",
        "usage": "Send a POST request to /predict with user data"
    }