import random

def classify_disease(crop, image_path=None, description=None):
    """Mock crop disease classifier (demo version)."""
    diseases_by_crop = {
        "wheat": ["Rust", "Powdery Mildew", "Smut"],
        "rice": ["Blast", "Bacterial Leaf Blight", "Brown Spot"],
        "tomato": ["Early Blight", "Late Blight", "Leaf Curl"],
        "onion": ["Downy Mildew", "Purple Blotch"],
        "maize": ["Turcicum Leaf Blight", "Rust"]
    }

    crop = crop.lower().strip()
    possible_diseases = diseases_by_crop.get(crop, ["Healthy"])
    return random.choice(possible_diseases)

