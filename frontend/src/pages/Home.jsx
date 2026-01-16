import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // redirect to home after logout
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <main>
      {/* HERO (full-bleed, fills viewport minus header) */}
      <section className="card hero">
        <div className="card-inner">
          <div className="hero-text">
            <h1 className="hero-title">Smart Circular Marketplace</h1>
            <div className="hero-tagline">Transform Waste into Worth.</div>
            <p className="hero-desc">
              Reduce waste, reuse items, and empower local repair & recycling businesses.
              List items, find nearby services, and track your environmental impact — all
              in one intelligent platform.
            </p>

            <div className="hero-ctas">
              <Link to="/marketplace">
                <button className="btn primary">Explore Marketplace</button>
              </Link>
              <Link to="/upload">
                <button className="btn ghost" style={{ marginLeft: 10 }}>Upload Item</button>
              </Link>

              {/* Show Login & Signup buttons only if not logged in */}
              {!currentUser ? (
                <>
                  <button
                    className="btn primary"
                    style={{ marginLeft: 10 }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="btn primary"
                    style={{ marginLeft: 10 }}
                    onClick={() => navigate("/signup")}
                  >
                    Signup
                  </button>
                </>
              ) : (
                // Show Logout + Welcome if logged in
                <>
                  <span style={{ marginLeft: 10, marginRight: 10 }}>
                    Welcome, {currentUser.email}
                  </span>
                  <button
                    className="btn ghost"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hero-stats" aria-hidden>
            <div className="stat">
              <div className="stat-value">50k+</div>
              <div className="stat-label">Items reused</div>
            </div>
            <div className="stat">
              <div className="stat-value">120t</div>
              <div className="stat-label">Waste diverted</div>
            </div>
            <div className="stat">
              <div className="stat-value">3.2k</div>
              <div className="stat-label">Green partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES (full-bleed wrapper, content centered inside .container) */}
      <section className="card features">
        <div className="card-inner container">
          <h3 className="section-title">Core Features</h3>

          <div className="features-grid" role="list">
            <article className="feature-card" role="listitem">
              <h4>AI Reuse & Pricing</h4>
              <p>Smart lifecycle analysis and dynamic pricing to get fair resale values and recycling recommendations.</p>
            </article>

            <article className="feature-card" role="listitem">
              <h4>Geo Services</h4>
              <p>Find nearby repair shops, recycling centers, and schedule pickups with verified local partners.</p>
            </article>

            <article className="feature-card" role="listitem">
              <h4>Eco Impact</h4>
              <p>Track carbon savings, waste diverted, and your contribution to a circular economy.</p>
            </article>

            <article className="feature-card" role="listitem">
              <h4>Community Exchange</h4>
              <p>Donate, swap, or sell items to extend product lifecycles and support sustainable consumption.</p>
            </article>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="card how">
        <div className="card-inner container">
          <h3 className="section-title">How it works</h3>
          <ol className="how-list">
            <li><strong>Upload:</strong> Snap or describe your item and get an instant AI suggestion.</li>
            <li><strong>Decide:</strong> Choose to repair, resell, swap, or recycle based on recommendations.</li>
            <li><strong>Connect:</strong> Find local repairers or schedule a pickup with a recycler.</li>
            <li><strong>Track:</strong> See your eco-impact on the dashboard.</li>
          </ol>
        </div>
      </section>
    </main>
  );
};

export default Home;
