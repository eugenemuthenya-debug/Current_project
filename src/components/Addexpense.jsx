import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import api from '../api/axiosInstance';

// Common spending categories for the quick-pick chips
// this are predefined,they will be used later
const CATEGORIES = ["Food", "Transport", "Rent", "Groceries", "Utilities", "Entertainment", "Health", "Other"];

// main function
const Addexpense = () => {

  // ──  state ──────────────────────────────────────────
  const [user, setUser] = useState({});
  // for our ever changing endpoint
  // const baseUrl="https://financial-backend-ps2l.onrender.com"

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid user in localStorage");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const [description, setDescription] = useState("");
  const [amount,      setAmount]      = useState("");
  const [spending,    setSpending]    = useState("");
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState("");
  const [success,     setSuccess]     = useState("");
  // const accessToken = localStorage.getItem("access_token");

  // ──  submit ─────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    setError(""); setSuccess("");
    setLoading("Please wait while we add your expense...");
    try {
      const response = await api.post("/add_expenses",
        { description, amount, category_name: spending }
      );
      setLoading("");
      setSuccess(response.data.message);
      setDescription(""); setAmount(""); setSpending("");
    } catch (error) {
      setLoading("");
      setSuccess("");
      setError(error.response?.data?.message || error.message);
      // console.log("Full error:", error.response?.data);
    }
  };

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }

        .exp-input {
          width: 100%;
          padding: 11px 14px;
          background: #0f1117;
          border: 1px solid #1f2535;
          border-radius: 10px;
          color: #e8e8e8;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border .2s;
        }
        .exp-input::placeholder { color: #4b5563; }
        .exp-input:focus { border-color: #3b4060; }

        .chip {
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid #1f2535;
          background: transparent;
          color: #9ca3af;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all .15s;
        }
        .chip:hover  { border-color: #3b4060; color: #e8e8e8; }
        .chip.active { background: #1e2333; border-color: #3b4060; color: #ffffff; }

        .exp-btn {
          width: 100%;
          padding: 12px;
          background: #185FA5;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background .2s, opacity .2s;
        }
        .exp-btn:hover:not(:disabled) { background: #1a6dbf; }
        .exp-btn:disabled { opacity: .6; cursor: not-allowed; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .exp-card { animation: fadeUp .3s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Navbar />

      <div style={S.center}>
        <div style={S.card} className="exp-card">

          {/* Greeting */}
          <div style={S.greeting}>
            <span style={S.avatar}>{user?.username?.[0]?.toUpperCase() || "G"}</span>
            <div>
              <p style={S.greetName}>Hi, {user?.username || "Guest"} 👋</p>
              <p style={S.greetSub}>What would you like to add today?</p>
            </div>
          </div>

          <div style={S.divider} />

          {/* Status banners */}
          {loading && (
            <div style={S.infoBanner}>
              <span style={S.spinner} />
              {loading}
            </div>
          )}
          {error   && <div style={S.errBanner}>⚠ {error}</div>}
          {success && <div style={S.okBanner}>✓ {success}</div>}

          {/* Form */}
          <form onSubmit={submit} style={{ marginTop: "1.25rem" }}>

            {/* Amount */}
            <div style={S.field}>
              <label style={S.label}>Amount (KSh)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                required
                className="exp-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Description */}
            <div style={S.field}>
              <label style={S.label}>Description</label>
              <input
                type="text"
                placeholder="Describe your purchase"
                required
                className="exp-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category — quick chips + manual input */}
            <div style={S.field}>
              <label style={S.label}>Category</label>

              {/* Quick-pick chips */}
              <div style={S.chips}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`chip ${spending === cat ? "active" : ""}`}
                    onClick={() => setSpending(spending === cat ? "" : cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Or type a custom one */}
              <input
                type="text"
                placeholder="Or type a custom category..."
                className="exp-input"
                style={{ marginTop: "8px" }}
                value={spending}
                onChange={(e) => setSpending(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="exp-btn"
              disabled={!!loading}
              style={{ marginTop: "0.5rem" }}
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0f1117",
    minHeight: "100vh",
    color: "#e8e8e8",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2rem 1rem",
    minHeight: "calc(100vh - 56px)",
  },
  card: {
    background: "#161b27",
    border: "1px solid #1f2535",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "460px",
  },
  greeting: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "1.25rem",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #185FA5, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  greetName: { fontSize: "16px", fontWeight: 600, color: "#ffffff", margin: 0 },
  greetSub:  { fontSize: "12px", color: "#6b7280", margin: "2px 0 0" },
  divider:   { height: "1px", background: "#1f2535", marginBottom: "1.25rem" },
  infoBanner: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#1e2130", border: "1px solid #2a2d36",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "13px", color: "#9ca3af",
  },
  spinner: {
    display: "inline-block", width: "13px", height: "13px",
    border: "2px solid #3b4060", borderTopColor: "#6366f1",
    borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0,
  },
  errBanner: {
    background: "#1f1217", border: "1px solid #5b2020",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "13px", color: "#f87171", marginTop: "0.75rem",
  },
  okBanner: {
    background: "#0f1f14", border: "1px solid #1f4d2a",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "13px", color: "#4ade80", marginTop: "0.75rem",
  },
  field: { marginBottom: "1rem" },
  label: {
    display: "block", fontSize: "12px", fontWeight: 500,
    color: "#9ca3af", marginBottom: "6px", letterSpacing: ".02em",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: "6px" },
};

export default Addexpense;