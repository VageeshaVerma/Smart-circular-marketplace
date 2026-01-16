import React, { useEffect, useState } from "react";
import axios from "axios";

import OverviewCards from "../components/dashboard/OverviewCards";
import MyListings from "../components/dashboard/MyListings";
import SmartRecommendations from "../components/dashboard/SmartRecommendations";
import RecentActivity from "../components/dashboard/RecentActivity";
import SustainabilityScore from "../components/dashboard/SustainabilityScore";

const API_BASE = "http://localhost:8000/api";

export default function Dashboard() {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/impact?user_id=demo`);
        setImpact(res.data);
      } catch (err) {
        console.error("Dashboard API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-300">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard-container text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* TOP OVERVIEW METRICS */}
      <OverviewCards impact={impact} />

      {/* USER LISTINGS */}
      <MyListings />

      {/* AI INSIGHTS */}
      <SmartRecommendations />

      {/* ACTIVITY LOG */}
      <RecentActivity />

      {/* SUSTAINABILITY SCORE */}
      <SustainabilityScore impact={impact} />
    </div>
  );
}
