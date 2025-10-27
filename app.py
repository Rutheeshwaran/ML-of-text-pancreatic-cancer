# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

# Initialize the Flask application
app = Flask(__name__)

# --- CRITICAL: Enable CORS for your React app ---
# This allows your React app (running on a different port) to make requests to this Flask server.
# Replace "http://localhost:3000" with the actual URL of your React app if it's different.
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

# Load your trained model from the pickle file
try:
    #with open('model.pkl', 'rb') as model_file:# Change this line
    with open('xgboost_model.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
    print("Model loaded successfully.")
except FileNotFoundError:
    print("Error: 'model.pkl' not found. Make sure the model file is in the same directory.")
    model = None

# Define the API endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not loaded.'}), 500

    # Get the JSON data sent from the React frontend
    data = request.get_json()
    print(f"Received data: {data}")

    try:
        # --- IMPORTANT ---
        # Convert the incoming JSON data into a format your model understands.
        # This usually means creating a Pandas DataFrame with the correct column names and order.
        # Make sure the keys in the JSON from React match these column names exactly.
        
        # Example feature names - YOU MUST REPLACE THESE WITH YOUR ACTUAL FEATURE NAMES
        feature_names = [
            'age', 'sex', 'creatinine', 'LYVE1', 'REG1B', 'TFF1', 'REG1A' 
            # ... add ALL the other feature names your model was trained on
        ]
        
        # Create a DataFrame from the received data
        input_df = pd.DataFrame([data], columns=feature_names)

        # --- Data Preprocessing ---
        # If you did any preprocessing (like converting 'sex' to 0/1, handling missing values),
        # you MUST do the exact same steps here.
        # Example:
        input_df['sex'] = input_df['sex'].apply(lambda x: 1 if x.lower() == 'm' else 0)
        
        # Make the prediction
        prediction = model.predict(input_df)
        
        # Get the probability scores if your model supports it (like RandomForest)
        try:
            probabilities = model.predict_proba(input_df)
            confidence = np.max(probabilities) * 100
        except AttributeError:
            confidence = "N/A" # Not all models have predict_proba

        # The prediction is often a NumPy array (e.g., array([2])). Convert it to a standard Python int.
        # Remember to convert back from [0, 1, 2] to [1, 2, 3] if you subtracted 1 during training.
        output_class = int(prediction[0]) + 1 
        
        # Create a mapping for your class names
        class_names = {1: "Healthy", 2: "Benign", 3: "Malignant (Fatal)"}
        prediction_text = class_names.get(output_class, "Unknown")
        
        # Send the prediction back as a JSON response
        return jsonify({
            'prediction': prediction_text,
            'class': output_class,
            'confidence': f"{confidence:.2f}%" if isinstance(confidence, float) else confidence
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 400

# Run the app
if __name__ == '__main__':
    # Use port 5000, which is standard for Flask development
    app.run(debug=True, port=5000)