import React, { useEffect, useState } from "react";
import axios from "axios";
import Marketplace from "./Marketplace";
import OverviewCards from "../components/dashboard/OverviewCards";
import MyListings from "../components/dashboard/MyListings";
import SmartRecommendations from "../components/dashboard/SmartRecommendations";
import RecentActivity from "../components/dashboard/RecentActivity";
import SustainabilityScore from "../components/dashboard/SustainabilityScore";
import { getAuthToken } from "../utils/getAuthToken";
const API_BASE = "http://localhost:8000/api";

export default function Dashboard() {
  const [impact, setImpact] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getAuthToken();
      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

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

  useEffect(() => {
    fetchOrders();
    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-300">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard-container text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* TOP OVERVIEW METRICS */}
      <OverviewCards orders={orders} />

      {/* USER LISTINGS */}
      <MyListings />

      {/* AI INSIGHTS */}
      <SmartRecommendations />

      {/* ACTIVITY LOG */}
      <RecentActivity orders={orders} refreshOrders={fetchOrders} />

      {/* SUSTAINABILITY SCORE */}
      <SustainabilityScore impact={impact} />
    </div>
  );
}
