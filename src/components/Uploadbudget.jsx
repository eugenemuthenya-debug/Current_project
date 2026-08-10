import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "../api/axiosInstance";

const Uploadbudget = () => {
  // ──  original state ──────────────────────────────────────────
  const [user, SetUser] = useState({});
  // for our ever changing endpoint

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        SetUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid user in localstorage");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const [amount_limit, setLimit] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const accessToken = localStorage.getItem("access_token");

  // ──  fetch existing budget on load ──────────────────────────────────────
  const [existingBudget, setExistingBudget] = useState(null); // holds current budget from API
  const [isUpdate, setIsUpdate] = useState(false); // true = updating, false = new

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await api.get("/get_budget", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // const data = response.data
        // if (data && data.length > 0) {
        //   // get the most recent budget entry
        const latest = response.data;
        // console.log("our data is", latest);
        if (latest) {
          setExistingBudget({
            amount_limit: Number(latest.amount_limit) || 0,
            start_date: latest.start_date,
            end_date:latest.end_date,
          });
          setIsUpdate(true); // there's already a budget — default to update mode
        }
      } catch (e) {
        // silently fail — user may not have data yet
        console.log("No existing budget found");
      }
    };
    if (accessToken) fetchBudget();
  }, [accessToken]);

  // ── Compute days remaining until budget month ends ──────────────────────────
  // const getDaysRemaining = (monthStr) => {
  //   if (!monthStr) return null
  //   // monthStr from Flask is "YYYY-MM-DD" (first of the month)
  //   const budgetDate  = new Date(monthStr)
  //   const year        = budgetDate.getFullYear()
  //   const month       = budgetDate.getMonth()
  //   // last day of that month
  //   const lastDay     = new Date(year, month + 1, 0)
  //   const today       = new Date()
  //   today.setHours(0, 0, 0, 0)
  //   const diffMs      = lastDay - today
  //   const diffDays    = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  //   return diffDays
  // }
  // const getBudgetEndDate = (monthStr) => {
  //   if (!monthStr) return "";

  //   const budgetDate = new Date(monthStr);
  //   const year = budgetDate.getFullYear();
  //   const month = budgetDate.getMonth();

  //   const lastDay = new Date(year, month + 1, 0);

  //   return lastDay.toLocaleDateString("en-GB", {
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //   });
  // };

  // const budgetEndDate = existingBudget
  //   ? getBudgetEndDate(existingBudget.month)
  //   : null;

  // // color based on urgency
  // const daysColor = budgetEndDate === null ? "#6b7280"
  //   : budgetEndDate <= 3  ? "#f87171"   // red — almost over
  //   : budgetEndDate <= 7  ? "#f59e0b"   // amber — ending soon
  //   : "#4ade80"                     // green — plenty of time

  // computing our budget progress bar
const getBudgetProgress=(start,end)=>{
  if(!start || !end) return 0

  const startDate=new Date(start)
  const endDate=new Date(end)
  const today=new Date()
 
  // we rest all our times to midnight
  startDate.setHours(0,0,0,0)
  endDate.setHours(0,0,0,0)
  today.setHours(0,0,0,0)
   
  // since js stores time in milliseconds,we convert it back to days through division
  // Math.max(1,0)-->returns the maximum,largest number it was given 
  // Math.min(0,1)-->returns the smallest number it was given
  const totalDays=Math.max(1,(endDate-startDate)/(1000*60*60*24))
  

  const elapsedDays=
  (today-startDate)/(1000*60*60*24)

  const percent=
  Math.min(100,Math.max(0,(elapsedDays/totalDays)*100))

  return Math.round(percent)
}
 
 
  const submit = async (e) => {
    e.preventDefault();
    if (Number(amount_limit) <= 10) {
      setError("Amount must be greater than 10");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(isUpdate ? "Updating your budget..." : "Adding your budget...");

    try {
      const response = await api.post(
        "/upload_budget",
        { amount_limit, start_date,end_date },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setLoading("");
      setSuccess(response.data.message);

      // update the displayed existing budget immediately
      setExistingBudget({
        amount_limit: parseFloat(amount_limit),
        start_date: start_date,
        end_date:end_date
      });
      setIsUpdate(true);

      setStartDate("")
      setEndDate("")
      setLimit("");
    } catch (error) {
      setLoading("");
      setError(error.response?.data?.message || error.message);
      // console.log("Full error:", error.response?.data)
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const fmt = (n) => "KSh " + Number(n).toLocaleString();
  const fmtDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { day:"numeric", month: "short",year: "numeric", });
  };

  const budgetProgress=existingBudget?getBudgetProgress(
    existingBudget.start_date,
    existingBudget.end_date)
    :0

    const getDaysRemaining=(end)=>{
      if (!end) return 0

      const today=new Date()
      const endDate=new Date(end)

      today.setHours(0,0,0,0)
      endDate.setHours(0,0,0,0)

      return Math.max(0,
        Math.ceil((endDate-today)/(1000*60*60*24))
      )
      // Math.ceil()-->comes from ceiling
      // Math.ceil()->it pushes a float[3.8] to the next whole number eg:3.8->4 or 3.6->4 or 3.1->3
      // if the number is a whole number 3.0->3
      // we also have Math.floor
    }

    const daysRemaining=existingBudget?getDaysRemaining(existingBudget.end_date)
    :0
  // console.log("your budget progress is",budgetProgress)
  // // console.log("calculations",existingBudget)
  // console.log("your days remaining",daysRemaining)

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
          color-scheme:dark;
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
            <span style={S.avatar}>
              {user?.username?.[0]?.toUpperCase() || "G"}
            </span>
            <div>
              <p style={S.greetName}>Hi, {user?.username || "Guest"} 👋</p>
              <p style={S.greetSub}>Manage your monthly budget</p>
            </div>
          </div>

          {/* ── Current budget summary card ── */}
{existingBudget && (
  <div style={S.summaryCard}>
    <div style={S.summaryRow}>

      {/* Budget Amount */}
      <div>
        <p style={S.summaryLabel}>Current Budget</p>
        <p style={S.summaryValue}>
          {fmt(existingBudget.amount_limit)}
        </p>
      </div>

      {/* Budget Period */}
      <div style={{ textAlign: "right" }}>
        <p style={S.summaryLabel}>Budget Period</p>

        <div style={S.periodContainer}>
          <span>{fmtDate(existingBudget.start_date)}</span>

          <span style={S.arrow}>↓</span>

          <span>{fmtDate(existingBudget.end_date)}</span>
        </div>
      </div>

    </div>

    <hr
      style={{
        border: "none",
        borderTop: "1px solid #2a2d36",
        margin: "18px 0",
      }}
    />

    <div style={S.daysRow}>
      <span style={S.daysLabel}>
        ⏳ Ends on <strong>{fmtDate(existingBudget.end_date)}</strong>
      </span>
    </div>

    {/* progress bar */}
   <div style={S.progressContainer}>

     <div style={S.progressTrack}>
      <div style={{...S.progressFill,width:`${budgetProgress}%`}}>
      </div>

      
    </div>

    <div style={S.progressText}>
        <div style={S.daysRow}>
          Budget Percentage:
          <strong style={{color:"#e8e8e8"}}>{budgetProgress}% completed</strong>
        </div>
        
        <div style={S.daysRow}>
          Days remaining:
          <span style={{color:"#e8e8e8"}}>{daysRemaining} days remaining</span>

        </div>
      </div>

   </div>
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
              <span style={S.spinner} />
              {loading}
            </div>
          )}
          {error && <div style={S.errBanner}>⚠ {error}</div>}
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

            <div style={S.field}>
              <label style={S.label}>Start Date</label>

              <input
                type="date"
                required
                className="bud-input"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div
              style={{
                ...S.field,
                marginBottom: "1.5rem",
              }}
            >
              <label style={S.label}>End Date</label>

              <input
                type="date"
                required
                className="bud-input"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <p style={S.hint}>Choose when this budget expires.</p>
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
  );
};

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
    height: "fit-content",
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
  greetSub: { fontSize: "12px", color: "#6b7280", margin: "2px 0 0" },

  // current budget summary
  progressContainer:{
    marginTop:"18px"
  },

  progressTrack: {
  width: "100%",
  height: "10px",
  background: "#2d3748",
  borderRadius: "999px",
  overflow: "hidden",
  marginTop: "14px",
},

progressFill: {
  height: "100%",
  background: "linear-gradient(90deg, #22c55e, #3b82f6)",
  borderRadius: "999px",
  transition: "width 0.4s ease",
},

progressText: {
  marginTop: "8px",
  fontSize: "13px",
  color: "#626974",
},
  summaryCard: {
    background: "#0f1117",
    border: "1px solid #1f2535",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "1.25rem",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  summaryLabel: {
    fontSize: "11px",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: ".05em",
    margin: "0 0 4px",
  },
  summaryValue: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#e2e8f0",
    margin: 0,
  },
  daysRow: { display: "flex", alignItems: "center", gap: "10px" },
  daysLabel: { fontSize: "12px", fontWeight: 500, flexShrink: 0 },
  daysBarWrap: {
    flex: 1,
    height: "5px",
    background: "#1e2333",
    borderRadius: "3px",
    overflow: "hidden",
  },
  daysBar: {
    height: "100%",
    borderRadius: "3px",
    transition: "width .5s ease",
  },
  expiredNote: {
    fontSize: "12px",
    color: "#f87171",
    marginTop: "10px",
    marginBottom: 0,
  },

  divider: { height: "1px", background: "#1f2535", margin: "1.25rem 0" },
  modeLabel: { fontSize: "13px", color: "#9ca3af", marginBottom: "0.5rem" },

  infoBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#1e2130",
    border: "1px solid #2a2d36",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#9ca3af",
  },
  spinner: {
    display: "inline-block",
    width: "13px",
    height: "13px",
    border: "2px solid #3b4060",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  },
  errBanner: {
    background: "#1f1217",
    border: "1px solid #5b2020",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#f87171",
    marginTop: "0.75rem",
  },
  okBanner: {
    background: "#0f1f14",
    border: "1px solid #1f4d2a",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#4ade80",
    marginTop: "0.75rem",
  },
  field: { marginBottom: "1rem" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "#9ca3af",
    marginBottom: "6px",
    letterSpacing: ".02em",
  },
  hint: {
    fontSize: "11px",
    color: "#4b5563",
    marginTop: "5px",
    marginBottom: 0,
  },

  periodContainer: {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "6px",
},

 arrow: {
  color: "#6b7280",
  fontSize: "15px",
  fontWeight: "bold",
},
};

export default Uploadbudget;
