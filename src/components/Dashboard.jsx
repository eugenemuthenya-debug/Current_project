import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios'

const CAT_COLORS = {
  Rent: "#185FA5", Groceries: "#3B6D11", Transport: "#BA7517",
  Utilities: "#534AB7", Entertainment: "#993556", Food: "#993C1D",
  Health: "#0F6E56", Other: "#5F5E5A",
};
const getCatColor = (cat) => CAT_COLORS[cat] || "#888780";
const fmt = (n) => "KSh " + Number(n).toLocaleString()

// other small components we will reqire in our dashboard also gotten from a repo on github
function SpendingBar({ cat, amount, max }) {
  const pct = Math.round((amount / max) * 100);
  return (
    <div style={S.spendRow}>
      <div style={S.spendLabel}>{cat}</div>
      <div style={S.barWrap}>
        <div style={{ height: "100%", borderRadius: "3px", width: `${pct}%`, background: getCatColor(cat), transition: "width .5s ease" }} />
      </div>
      <div style={S.spendAmt}>{fmt(amount)}</div>
    </div>
  );
}

function BudgetBar({ label, spent, limit }) {
  const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const barColor = pct > 85 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#22c55e";
  return (
    <div style={S.budgetRow}>
      <div style={S.budgetTop}>
        <span style={{ color: "#c9d0dc" }}>{label}</span>
        <span style={{ color: "#6b7280" }}>{pct}%</span>
      </div>
      <div style={S.budgetBarWrap}>
        <div style={{ height: "100%", borderRadius: "4px", width: `${pct}%`, background: barColor, transition: "width .5s ease" }} />
      </div>
    </div>
  );
}

// styles-->gotten from git hub repo of the the project,we will use it to style our dashboard
const S = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e8e8e8", padding: "2rem" },
  topbar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" },
  h1: { fontSize: "20px", fontWeight: 600, color: "#ffffff", marginBottom: "3px" },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  toggleWrap: { display: "flex", gap: "6px" },
  btnBase: { fontSize: "12px", padding: "6px 14px", borderRadius: "8px", border: "1px solid #2a2d36", background: "transparent", color: "#9ca3af", cursor: "pointer" },
  btnActive: { background: "#1e2130", color: "#ffffff", border: "1px solid #3b4060" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "1.25rem" },
  metricCard: { background: "#161b27", border: "1px solid #1f2535", borderRadius: "12px", padding: "16px 18px" },
  metricLabel: { fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "8px" },
  metricValue: { fontSize: "22px", fontWeight: 600 },
  metricSub: { fontSize: "11px", color: "#6b7280", marginTop: "4px" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px", marginBottom: "10px" },
  card: { background: "#161b27", border: "1px solid #1f2535", borderRadius: "12px", padding: "1.25rem" },
  cardTitle: { fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "1rem" },
  spendRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  spendLabel: { fontSize: "13px", color: "#c9d0dc", width: "100px", flexShrink: 0 },
  barWrap: { flex: 1, height: "6px", background: "#1e2333", borderRadius: "3px", overflow: "hidden" },
  spendAmt: { fontSize: "12px", color: "#6b7280", width: "70px", textAlign: "right", flexShrink: 0 },
  txnRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #1e2535" },
  txnName: { fontSize: "13px", fontWeight: 500, color: "#e2e8f0", marginBottom: "2px" },
  txnDate: { fontSize: "11px", color: "#6b7280" },
  txnAmt: { fontSize: "13px", fontWeight: 600, color: "#f87171" },
  budgetRow: { marginBottom: "14px" },
  budgetTop: { display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" },
  budgetBarWrap: { height: "6px", background: "#1e2333", borderRadius: "4px", overflow: "hidden" },
  legendWrap: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" },
  legendItem: { display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#9ca3af" },
  legendDot: { width: "9px", height: "9px", borderRadius: "2px", flexShrink: 0 },
  canvasWrap: { position: "relative", width: "100%", height: "180px" },
  // status banners
  loadBanner: { background: "#1e2130", border: "1px solid #2a2d36", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#9ca3af", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" },
  errBanner: { background: "#1f1217", border: "1px solid #5b2020", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#f87171", marginBottom: "1rem" },
  spinner: { width: "14px", height: "14px", border: "2px solid #3b4060", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 },
};

// our main function
const Dashboard = () => {

  //messages
  const [loading, setLoading] = useState("")
  const [error, setError] = useState("")

  // where we store our data from flask api as a list cos our data comes as a list of objects
  const [spentData, setSpentData] = useState([])
  const [view, setView] = useState("month")

  // our get function to fetch data from flask and display it on the dashboard

  // useEffect-->
  useEffect(() => {
    const getData = async () => {

      // token from sign in component
      const token = localStorage.getItem('token')
      //fetching data
      setLoading("Please wait while we fetch your data...")
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/get_spendings"
          , { headers: { Authorization: `Bearer ${token}` } }

       
        )

        //  console.log("RAW DATA:", response.data)      
        //  console.log("FIRST ITEM:", response.data[0])
        setLoading("")
        setSpentData(response.data.map(item => ({
          ...item,
          amount: parseFloat(item.amount) || 0,
          amount_limit: parseFloat(item.amount_limit) || 0
        })))

      } catch (error) {
        setLoading("")
        setError(error.response?.data?.message || error.message)

        // this will help us see the full error,we will comment out later when stable
        // console.log("Full error:", error.response?.data)
      }
    }
    // call the function

    // error handle

    getData()
  }, [])

  // since we created our view state,we will be able to use to filter our data based on the view month selected by user

  // 1.create a function called view
  const filtered = (() => {
    if (view === "all") return spentData
    // incase the user wants to view everyhting...then the entire spent info will be rendered
    const mo = new Date().toISOString().slice(0, 7)
    // now the date format has individual characters treated as strings,thats why we did this(0,7) to get month and year alone without the date.
    return spentData.filter((d) => d.date.startsWith(mo))
  })()
  // mo-->months,d-->parameter that represents each item in the spentData list,filter-->used to create a new array with all elements that pass the test implemented by the provided function,startsWith-->used to check if the date starts with the current month and year

  // derived values
  const totalSpent = filtered.reduce((s, d) => s + d.amount, 0)
  const latestlimit = filtered[0]?.amount_limit || 0
  const remaining = latestlimit - totalSpent

  const catTotals = {};
  filtered.forEach(({ spending, amount }) => {
    catTotals[spending] = (catTotals[spending] || 0) + amount;
  });
  const catList = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const maxCat = catList[0]?.[1] || 1;
  const recent = filtered.slice(0, 6);

  // username from first record,if available
  const username = spentData[0]?.username || "";
  const phone = spentData[0]?.phone || "";
  // UI


  return (
    <div>
      <Navbar />
      <div style={S.page}>
        {/* spinner/error banners */}
        {loading && (
          <div style={S.loadBanner}>
            <div style={S.spinner} />
            {loading}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
        {error && <div style={S.errBanner}>Error: {error}</div>}

        {/* top bar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.h1}>Finance Overview</h1>
            {username && <p style={S.subtitle}>{username}.{phone}</p>}

            <div style={S.toggleWrap}>
              {["month", "all"].map((v) => (
                <button key={v} onClick={() => setView(v)}
                  style={view === v ? { ...S.btnBase, ...S.btnActive } : S.btnBase}>
                  {v === "month" ? "This month" : "All time"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* metric cards */}
        <div style={S.metricsGrid}>
          {[
            { label: "Total spent", value: fmt(totalSpent), sub: `${filtered.length} transactions`, color: "#f87171" },
            { label: "Budget limit", value: fmt(latestlimit), sub: "this month", color: "#e2e8f0" },
            { label: "Remaining", value: fmt(Math.max(0, remaining)), sub: "available", color: remaining >= 0 ? "#4ade80" : "#f87171" },
            { label: "Categories", value: catList.length, sub: "spending areas", color: "#e2e8f0" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} style={S.metricCard}>
              <div style={S.metricLabel}>{label}</div>
              <div style={{ ...S.metricValue, color }}>{value}</div>
              <div style={S.metricSub}>{sub}</div>
            </div>
          ))}
        </div>

        {/* recent transactions */}
        <div style={S.card}>
          <div style={S.cardTitle}>Recent transactions</div>
          {recent.length === 0
            ? <p style={{ color: "#6b7280", fontSize: "13px" }}>No transactions for this period.</p>
            : recent.map((item, index) => (
              <div key={index}
                style={index === recent.length - 1
                  ? { ...S.txnRow, borderBottom: "none" }
                  : S.txnRow}>
                <div>
                  <div style={S.txnName}>{item.spending}</div>
                  {/* same format as your original: new Date().toLocaleDateString() */}
                  <div style={S.txnDate}>{new Date(item.date).toLocaleDateString()}</div>
                </div>
                <div style={S.txnAmt}>-{item.amount.toLocaleString()}</div>
              </div>
            ))
          }

        </div>


        {/* charts row */}
        <div style={S.grid2}>
          <div style={S.card}>
            <div style={S.cardTitle}>Spending by category</div>
            {catList.map(([cat, amt]) => (
              <SpendingBar key={cat} cat={cat} amount={amt} max={maxCat} />
            ))}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>Budget progress</div>
            <BudgetBar label="Total budget" spent={totalSpent} limit={latestlimit} />
            {catList.slice(0, 5).map(([cat, amt]) => (
              <BudgetBar key={cat} label={cat} spent={amt} limit={latestlimit} />
            ))}
          </div>
        </div>






      </div>

    </div>
  )
}

export default Dashboard
