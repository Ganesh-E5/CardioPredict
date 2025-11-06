import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import joblib

MODEL_FOLDER = "models"
os.makedirs(MODEL_FOLDER, exist_ok=True)

def train_model(dataset_path: str):
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found: {dataset_path}")

    data = pd.read_csv(dataset_path, sep=";")

    if 'id' in data.columns:
        data = data.drop('id', axis=1)

    
    data['bmi'] = data['weight'] / ((data['height']/100)**2)
    data['pulse_pressure'] = data['ap_hi'] - data['ap_lo']
    data['age_years'] = data['age'] / 365
    data=data.drop('age',axis=1)
    # Features and target
    X = data.drop('cardio', axis=1)
    y = data['cardio']

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train Random Forest
    rf = RandomForestClassifier(n_estimators=200,max_depth=10, random_state=42)
    rf.fit(X_train, y_train)

    # Predict and calculate accuracy
    y_pred = rf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model trained on {dataset_path} | Accuracy: {accuracy:.4f}")

    # Save model, scaler, and accuracy
    joblib.dump(rf, os.path.join(MODEL_FOLDER, "rf_model.pkl"))
    joblib.dump(scaler, os.path.join(MODEL_FOLDER, "scaler.pkl"))
    joblib.dump(accuracy, os.path.join(MODEL_FOLDER, "accuracy.pkl"))

    return rf, scaler, accuracy

