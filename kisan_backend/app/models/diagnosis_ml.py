 
# Example dummy ML classifier (replace with real model code)
def classify_disease(crop, image_path=None, description=None):
    # In production: load ML model and predict from image/description
    # Here, pick a mock disease based on crop
    DISEASES = {
        "wheat": ["Rust", "Powdery Mildew", "Smut"],
        "rice": ["Blast", "Bacterial Leaf Blight", "Brown Spot"],
        "tomato": ["Early Blight", "Late Blight", "Leaf Curl"],
        "onion": ["Downy Mildew", "Purple Blotch"],
        "maize": ["Turcicum Leaf Blight", "Rust"]
    }
    import random
    disease = random.choice(DISEASES.get(crop.lower(), ["Healthy"]))
    return disease
