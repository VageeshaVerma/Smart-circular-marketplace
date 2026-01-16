import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  const handleLogout = async () => {
    await logout();
    navigate("/"); // redirect to home after logout
  };

  return (
    <header>
      <h1>Smart Circular Marketplace</h1>
      <nav>
        <NavLink to="/" className={linkClass} end>
          <button>Home</button>
        </NavLink>
        <NavLink to="/marketplace" className={linkClass}>
          <button>Marketplace</button>
        </NavLink>
        <NavLink to="/upload" className={linkClass}>
          <button>Upload Item</button>
        </NavLink>
        <NavLink to="/map" className={linkClass}>
          <button>Map</button>
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          <button>Dashboard</button>
        </NavLink>

        {/* Show Login/Signup or Logout dynamically */}
        {!currentUser ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Signup</button>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
