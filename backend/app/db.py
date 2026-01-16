from typing import List, Dict

# Items listed in marketplace
ITEMS: List[Dict] = []

# Nearby services (sample data)
NEARBY_SERVICES: List[Dict] = [
    {"name": "E-Waste Recycler 1", "lat": 28.705, "lng": 77.105, "type": "recycler"},
    {"name": "Repair Center 1", "lat": 28.707, "lng": 77.101, "type": "repair"},
    {"name": "Plastic Recycling Unit", "lat": 28.703, "lng": 77.107, "type": "recycler"},
]

# User impact data (dummy)
USER_IMPACT = {
    "demo": {
        "waste_diverted_kg": 50,
        "carbon_saved_kg": 120,
        "items_reused": 15
    }
}
