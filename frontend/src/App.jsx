import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UploadForm from "./pages/UploadForm";
import Marketplace from "./pages/Marketplace";
import MapView from "./pages/MapView";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import axios from "axios";
import ServerWarmup from "./components/ServerWarmup";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const wakeUp = async () => {
      try {
        await axios.get(`${BACKEND_URL}/api/health`);
        if (mounted) setApiReady(true);
      } catch {
        // retry every 5 seconds until backend wakes up
        const interval = setInterval(async () => {
          try {
            await axios.get(`${BACKEND_URL}/api/health`);
            setApiReady(true);
            clearInterval(interval);
          } catch {}
        }, 5000);
      }
    };

    wakeUp();

    return () => {
      mounted = false;
    };
  }, []);

  // 👇 Show loader while Render backend is cold
  if (!apiReady) {
    return <ServerWarmup />;
  }
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
