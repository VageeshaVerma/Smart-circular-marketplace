import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadow,
});
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// Custom colored markers (optional)
const repairIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const recyclingIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});



export default function MapView() {
  const [services, setServices] = useState([]);
  const [userLocation, setUserLocation] = useState({
    lat: 28.7041, // fallback
    lng: 77.1025,
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.warn("Geolocation failed, using default location")
      );
    }
  }, []);

  // Fetch nearby services
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/nearby/osm?lat=${userLocation.lat}&lng=${userLocation.lng}`)
      .then((res) => {
        // Sort by nearest first
        const sorted = res.data.sort((a, b) => a.distance_km - b.distance_km);
        setServices(sorted);
      })
      .catch(console.error);
  }, [userLocation]);

  return (
    <div>
      <h2>Nearby Repair & Recycling Services</h2>

      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: "70vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Service markers */}
        {services.map((s, i) => (
          <Marker
            key={i}
            position={[s.lat, s.lng]}
            icon={s.type.toLowerCase().includes("repair") ? repairIcon : recyclingIcon}
          >
            <Popup>
              <strong>{s.name}</strong>
              <br />
              {s.type}
              <br />
              📍 {s.distance_km} km away
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Distance-ranked list */}
      <h3>Nearest First</h3>
      <ul>
        {services.map((s, i) => (
          <li key={i}>
            <strong>{s.name}</strong> — {s.distance_km} km
          </li>
        ))}
      </ul>
    </div>
  );
}
