import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'

const Uploadbudget = () => {

  // ──  original state ──────────────────────────────────────────
  const [user, SetUser] = useState({})
  // for our everchanging endpoint
  const bsaeUrl="http://127.0.0.1:5000/api"

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser && storedUser !== "undefined") {
      try {
        SetUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Invalid user in localstorage")
        localStorage.removeItem("user")
      }
    }
  }, [])

  const [amount_limit, setLimit] = useState("")
  const [month,        setMonth] = useState("")
  const [loading,      setLoading] = useState("")
  const [success,      setSuccess] = useState("")
  const [error,        setError]   = useState("")
  const token = localStorage.getItem("token")

  // ──  fetch existing budget on load ──────────────────────────────────────
  const [existingBudget, setExistingBudget] = useState(null) // holds current budget from API
  const [isUpdate,       setIsUpdate]       = useState(false) // true = updating, false = new

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/get_spendings",
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = response.data
        if (data && data.length > 0) {
          // get the most recent budget entry
          const latest = data[0]
          if (latest.amount_limit && latest.month) {
            setExistingBudget({
              amount_limit: parseFloat(latest.amount_limit) || 0,
              month: latest.month,
            })
            setIsUpdate(true) // there's already a budget — default to update mode
          }
        }
      } catch (e) {
        // silently fail — user may not have data yet
        console.log("No existing budget found")
      }
    }
    if (token) fetchBudget()
  }, [token])

  // ── Compute days remaining until budget month ends ──────────────────────────
  const getDaysRemaining = (monthStr) => {
    if (!monthStr) return null
    // monthStr from Flask is "YYYY-MM-DD" (first of the month)
    const budgetDate  = new Date(monthStr)
    const year        = budgetDate.getFullYear()
    const month       = budgetDate.getMonth()
    // last day of that month
    const lastDay     = new Date(year, month + 1, 0)
    const today       = new Date()
    today.setHours(0, 0, 0, 0)
    const diffMs      = lastDay - today
    const diffDays    = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = existingBudget ? getDaysRemaining(existingBudget.month) : null

  // color based on urgency
  const daysColor = daysLeft === null ? "#6b7280"
    : daysLeft <= 3  ? "#f87171"   // red — almost over
    : daysLeft <= 7  ? "#f59e0b"   // amber — ending soon
    : "#4ade80"                     // green — plenty of time

  // ── Your original submit, with update support added ─────────────────────────
  const submit = async (e) => {
    e.preventDefault()
    if (Number(amount_limit) <= 10) {
      setError("Amount must be greater than 10")
      return
    }
    setError(""); setSuccess("")
    setLoading(isUpdate ? "Updating your budget..." : "Adding your budget...")

    try {
      const response = await axios.post(bsaeUrl +
        "/upload_budget",
        { amount_limit, month },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLoading("")
      setSuccess(response.data.message)

      // update the displayed existing budget immediately
      setExistingBudget({
        amount_limit: parseFloat(amount_limit),
        month: month,
      })
      setIsUpdate(true)

      setMonth("")
      setLimit("")

    } catch (error) {
      setLoading("")
      setError(error.response?.data?.message || error.message)
      console.log("Full error:", error.response?.data)
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const fmt     = (n) => "KSh " + Number(n).toLocaleString()
  const fmtDate = (d) => {
    if (!d) return ""
    const date = new Date(d)
    return date.toLocaleDateString("en-KE", { year: "numeric", month: "long" })
  }

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .bud-input {
          width: 100%; padding: 11px 14px;
          background: #0f1117; border: 1px solid #1f2535;
          border-radius: 10px; color: #e8e8e8;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border .2s;
        }
        .bud-input::placeholder { color: #4b5563; }
        .bud-input:focus { border-color: #3b4060; }
        .bud-btn {
          width: 100%; padding: 12px;
          background: #185FA5; color: #fff;
          border: none; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background .2s, opacity .2s;
        }
        .bud-btn:hover:not(:disabled) { background: #1a6dbf; }
        .bud-btn:disabled { opacity: .6; cursor: not-allowed; }
        .bud-btn.update { background: #534AB7; }
        .bud-btn.update:hover:not(:disabled) { background: #6258d3; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .bud-card { animation: fadeUp .3s ease; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <Navbar />

      <div style={S.center}>
        <div style={S.card} className="bud-card">

          {/* Greeting */}
          <div style={S.greeting}>
            <span style={S.avatar}>{user?.username?.[0]?.toUpperCase() || "G"}</span>
            <div>
              <p style={S.greetName}>Hi, {user?.username || "Guest"} 👋</p>
              <p style={S.greetSub}>Manage your monthly budget</p>
            </div>
          </div>

          {/* ── Current budget summary card ── */}
          {existingBudget && (
            <div style={S.summaryCard}>
              <div style={S.summaryRow}>
                <div>
                  <p style={S.summaryLabel}>Current budget</p>
                  <p style={S.summaryValue}>{fmt(existingBudget.amount_limit)}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={S.summaryLabel}>Period</p>
                  <p style={S.summaryValue}>{fmtDate(existingBudget.month)}</p>
                </div>
              </div>

              {/* Days remaining bar */}
              <div style={S.daysRow}>
                <span style={{ ...S.daysLabel, color: daysColor }}>
                  {daysLeft === null        ? "—"
                   : daysLeft <= 0         ? "Budget period has ended"
                   : daysLeft === 1        ? "1 day remaining"
                   : `${daysLeft} days remaining`}
                </span>
                {daysLeft > 0 && (
                  <div style={S.daysBarWrap}>
                    <div style={{
                      ...S.daysBar,
                      // show how much of the month is left (approx 30 days)
                      width: `${Math.min(100, Math.round((daysLeft / 30) * 100))}%`,
                      background: daysColor,
                    }} />
                  </div>
                )}
              </div>

              {/* Expired notice */}
              {daysLeft !== null && daysLeft <= 0 && (
                <p style={S.expiredNote}>
                  ⚠ Your budget period has ended. Set a new one below.
                </p>
              )}
            </div>
          )}

          <div style={S.divider} />

          {/* Mode label */}
          <p style={S.modeLabel}>
            {isUpdate && existingBudget
              ? "✏️  Update your budget"
              : "➕  Set a new budget"}
          </p>

          {/* Status banners */}
          {loading && (
            <div style={S.infoBanner}>
              <span style={S.spinner} />{loading}
            </div>
          )}
          {error   && <div style={S.errBanner}>⚠ {error}</div>}
          {success && <div style={S.okBanner}>✓ {success}</div>}

          {/* Form */}
          <form onSubmit={submit} style={{ marginTop: "1.25rem" }}>

            <div style={S.field}>
              <label style={S.label}>Budget amount (KSh)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                required
                className="bud-input"
                value={amount_limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>

            <div style={{ ...S.field, marginBottom: "1.5rem" }}>
              <label style={S.label}>Month</label>
              <input
                type="date"
                required
                className="bud-input"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <p style={S.hint}>Pick any day in the month you're budgeting for</p>
            </div>

            <button
              type="submit"
              className={`bud-btn ${isUpdate && existingBudget ? "update" : ""}`}
              disabled={!!loading}
            >
              {loading
                ? "Please wait..."
                : isUpdate && existingBudget
                  ? "Update Budget"
                  : "Set Budget"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

const S = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0f1117",
    minHeight: "100vh",
    color: "#e8e8e8",
  },
  center: {
    display: "flex", justifyContent: "center",
    padding: "2rem 1rem",
    minHeight: "calc(100vh - 56px)",
  },
  card: {
    background: "#161b27", border: "1px solid #1f2535",
    borderRadius: "16px", padding: "2rem",
    width: "100%", maxWidth: "460px",
    height: "fit-content",
  },
  greeting: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" },
  avatar: {
    width: "42px", height: "42px", borderRadius: "12px",
    background: "linear-gradient(135deg, #185FA5, #6366f1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  greetName: { fontSize: "16px", fontWeight: 600, color: "#ffffff", margin: 0 },
  greetSub:  { fontSize: "12px", color: "#6b7280", margin: "2px 0 0" },

  // current budget summary
  summaryCard: {
    background: "#0f1117", border: "1px solid #1f2535",
    borderRadius: "12px", padding: "14px 16px", marginBottom: "1.25rem",
  },
  summaryRow:  { display: "flex", justifyContent: "space-between", marginBottom: "12px" },
  summaryLabel:{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".05em", margin: "0 0 4px" },
  summaryValue:{ fontSize: "16px", fontWeight: 600, color: "#e2e8f0", margin: 0 },
  daysRow:     { display: "flex", alignItems: "center", gap: "10px" },
  daysLabel:   { fontSize: "12px", fontWeight: 500, flexShrink: 0 },
  daysBarWrap: { flex: 1, height: "5px", background: "#1e2333", borderRadius: "3px", overflow: "hidden" },
  daysBar:     { height: "100%", borderRadius: "3px", transition: "width .5s ease" },
  expiredNote: { fontSize: "12px", color: "#f87171", marginTop: "10px", marginBottom: 0 },

  divider:   { height: "1px", background: "#1f2535", margin: "1.25rem 0" },
  modeLabel: { fontSize: "13px", color: "#9ca3af", marginBottom: "0.5rem" },

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
  hint: { fontSize: "11px", color: "#4b5563", marginTop: "5px", marginBottom: 0 },
}

export default Uploadbudget