import requests
from math import radians, sin, cos, sqrt, atan2

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Distance calculation (km)
def haversine(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng/2)**2
    return 2 * R * atan2(sqrt(a), sqrt(1 - a))

def fetch_nearby_services(lat, lng, radius=5000):
    query = f"""
    [out:json];
    (
      node["amenity"="recycling"](around:{radius},{lat},{lng});
      node["shop"="repair"](around:{radius},{lat},{lng});
      node["amenity"="repair_cafe"](around:{radius},{lat},{lng});
    );
    out center;
    """

    response = requests.post(OVERPASS_URL, data={"data": query})
    data = response.json()

    services = []
    for el in data.get("elements", []):
        if "lat" in el and "lon" in el:
            distance = haversine(lat, lng, el["lat"], el["lon"])
            score = round((1 / (distance + 0.1)) * 100, 2)
            services.append({
                "name": el["tags"].get("name", "Unnamed Service"),
                "lat": el["lat"],
                "lng": el["lon"],
                "type": el["tags"].get("amenity") or el["tags"].get("shop"),
                "distance_km": round(distance, 2),
                "score": score
            })

    # 🔥 Distance-based ranking
    return sorted(services, key=lambda x: x["distance_km"])
