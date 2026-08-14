import React, { useCallback, useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "../api/axiosInstance";
import Tutorialmodel from "./Tutorialmodel";
import CategoryPieChart from "./CategoryPiechart";
import MonthlyTrend from "./MonthlyTrendChart";
import { useLocation } from "react-router-dom";


const CAT_COLORS = {
  Rent: "#185FA5",
  Groceries: "#3B6D11",
  Transport: "#BA7517",
  Utilities: "#534AB7",
  Entertainment: "#993556",
  Food: "#993C1D",
  Health: "#0F6E56",
  Other: "#5F5E5A",
};
const getCatColor = (cat) => CAT_COLORS[cat] || "#888780";
const fmt = (n) => "KSh " + Number(n ?? 0).toLocaleString();

// other small components we will require in our dashboard also gotten from a repo on github
function SpendingBar({ cat, amount, max }) {
  const pct = Math.round((amount / max) * 100);
  return (
    <div style={S.spendRow}>
      <div style={S.spendLabel}>{cat}</div>
      <div style={S.barWrap}>
        <div
          style={{
            height: "100%",
            borderRadius: "3px",
            width: `${pct}%`,
            background: getCatColor(cat),
            transition: "width .5s ease",
          }}
        />
      </div>
      <div style={S.spendAmt}>{fmt(amount)}</div>
    </div>
  );
}

// function BudgetBar({ label, spent, limit }) {
//   const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
//   const barColor = pct > 85 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#22c55e";
//   return (
//     <div style={S.budgetRow}>
//       <div style={S.budgetTop}>
//         <span style={{ color: "#c9d0dc" }}>{label}</span>
//         <span style={{ color: "#6b7280" }}>{pct}%</span>
//       </div>
//       <div style={S.budgetBarWrap}>
//         <div
//           style={{
//             height: "100%",
//             borderRadius: "4px",
//             width: `${pct}%`,
//             background: barColor,
//             transition: "width .5s ease",
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// styles-->gotten from git hub repo of the the project,we will use it to style our dashboard
const isMobile = window.innerWidth <= 768;

// our main function
const Dashboard = () => {
  //messages
  const [showTutorial, setShowTutorial] = useState(false);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const location = useLocation()

  const [latestLimit, setLatestLimit] = useState(0);
  const [budget, setBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [remaining, setRemaining] = useState(0);
  const [budgetSpent, setBudgetSpent] = useState(0);

  const goToPreviousMonth = () => {
    const current = new Date(selectedMonth + "-01");

    current.setMonth(current.getMonth() - 1);
    setSelectedMonth(current.toISOString().slice(0, 7));
  };

  const goToNextMonth = () => {
    const current = new Date(selectedMonth + "-01");
    current.setMonth(current.getMonth() + 1);
    setSelectedMonth(current.toISOString().slice(0, 7));
  };

  const displayMonth = new Date(selectedMonth + "-01").toLocaleDateString(
    "en-KE",
    {
      month: "long",
      year: "numeric",
    },
  );
  // console.log("month",selectedMonth)

  // where we store our data from flask api as a list cos our data comes as a list of objects
  const [spentData, setSpentData] = useState([]);
  const [view, setView] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [budgetStatus,setbudgetStatus] = useState("ACTIVE");
  const [allTimeSummary,setAllTimeSummary] = useState(null)
  const [monthlyHistory,setMonthlyHistory] = useState([])

  // banner: this detects change in state
  // true-->shows our update banner
  // false-->hides our update banner
  // we set it to local storage so tht it doesn't show every time the page refreshes.
  // the return is used to check if we have stored that this update was seen before preventing to re render
  const [updateBanner,setUpdateBanner] = useState(()=>{
    return localStorage.getItem("pesaWaziUpdateV1_1") !== "seen"
  })
  // view stored month.
  // searchTerm stores every letter as the user types when using search tab.

  // our get function to fetch data from flask and display it on the dashboard
  // useCallback->keep this function the same until one of the dependencies changes.
  // our dependency array counts on selected month due to month selector. When the selector changes from one month to another then the function is called again.

   const getBudgetSummary = useCallback( async () => {
    console.log("getBudgetSummary CALLED")
      try {
        const response = await api.get(
          `/get_budget_summary?month=${selectedMonth}`,
        );

        console.log("BUDGET RESPONSE:",response.data)

        const summary = response.data;

        setLatestLimit(Number(summary.amount_limit) || 0);
        setBudget(summary);
        setbudgetStatus("ACTIVE")
        setRemaining(Number(summary.remaining));
        setBudgetSpent(Number(summary.total_spent) || 0);
      } catch (error) {
         console.log("🔥 BUDGET ERROR:", error.response?.data || error.message)

        console.log("No budget found");
        setbudgetStatus("EXPIRED")
        setLatestLimit(0);
        setBudget(null);

        setBudgetSpent(0);
        setRemaining(0);
      }
    },[selectedMonth])

    // our use effect to be called after an expense has been added from add expense
    useEffect(()=>{
      if (location.state?.expenseAdded){
        getBudgetSummary()
      }
    },[location.state,getBudgetSummary])

  // useEffect-->
  useEffect(() => {
    const seenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!seenTutorial) {
      setShowTutorial(true);
    }
    // console.log(localStorage.getItem("hasSeenTutorial"));
    const getData = async () => {
      // token from sign in component
      // const accessToken = localStorage.getItem('access_token')
      //fetching data
      setLoading("Please wait while we fetch your data...");
      try {
        // const response = await api.get(
        //   `/get_spendings?month=${selectedMonth}`,
        //   //  { headers: { Authorization: `Bearer ${accessToken}` } }
        // );
        let response;

        if (view === "month") {
          response = await api.get(`/get_spendings?month=${selectedMonth}`);
        } else {
          response = await api.get("/get_spendings");
        }

        //  console.log("RAW DATA:", response.data)
        //  console.log(accessToken)
        //  console.log("FIRST ITEM:", response.data[0])
        setLoading("");
        setSpentData(
          response.data.map((item) => ({
            ...item,
            amount: parseFloat(item.amount) || 0,
            // amount_limit: parseFloat(item.amount_limit) || 0,
          })),
        );
      } catch (error) {
        setLoading("");
        setError(error.response?.data?.message || error.message);

        // this will help us see the full error,we will comment out later when stable
        // console.log("Full error:", error.response?.data)
      }
    };

   

    // get all time summary
    const getAllTimeSummary = async ()=>{
      try{
        const response = await api.get('/get_all_time_summary')
        setAllTimeSummary(response.data)
      } catch (error){
        console.log("No all time data")
        setAllTimeSummary(null)
      }
    } 

    const getMonthlyHistory = async ()=>{
      try{
        const response = await api.get("/get_monthly_spending")
        
        setMonthlyHistory(response.data)

      } catch(error){
        console.error("Failed to load monthly history", error)
        setMonthlyHistory([])

      }
    }
    // call the function

    // error handle
    // we introduce the if else statement for uniformity and prevent unnecessary calling of endpoints.

    if (view === "month"){
      getData();
      // getBudgetSummary();
    } else {
      getAllTimeSummary()
      getMonthlyHistory()
    }
  }, [selectedMonth, view]);

  // since we created our view state,we will be able to use to filter our data based on the view month selected by user

  // 1.create a function called view
  const startOfMonth = new Date(selectedMonth + "-01");
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);

  const filtered = (() => {
    if (view === "all") return spentData;
    // in case the user wants to view everything...then the entire spent info will be rendered
    // if (!budget) return [];
    // const start = new Date(budget.start_date);
    // const end = new Date(budget.end_date);

    return spentData.filter((item) => {
      const expenseDate = new Date(item.date);

      return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
    });
  })();
  const searchData = filtered.filter((item) => {
    const search = searchTerm.toLocaleLowerCase();

    const searchableText = `
    ${item.description || ""}
    ${item.spending || ""}
    ${item.amount || ""}
    ${new Date(item.date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`.toLowerCase();

    return searchableText.includes(search);
  });

  // console.log("Your data is:", searchData);
  // toLowerCase=despite the data stored in capslock in our database,we convert it when it is coming as lowercase to match our searchTerm.
  // the item,checks if what we type in the search filter has any relations to what is in the data we get and keeps it.
  // we either store description or categories since the user can search any of them.If they do search using either of them we include them in the filter.

  // mo-->months,d-->parameter that represents each item in the spentData list,filter-->used to create a new array with all elements that pass the test implemented by the provided function,startsWith-->used to check if the date starts with the current month and year

  // derived values

  const totalSpent = searchData.reduce((s, d) => s + d.amount, 0);
  // s and d are just parameters, s=sum of latest sum of expenses. d=item.amount(new expense added by user.)
  // console.log("S is:",searchData)
  // const latestlimit = filtered[0]?.amount_limit || 0;
  // const remaining = latestLimit - totalSpent;

  // console.log("this is your remaining:", remaining);

  // Largest expense
  // const largestExpense =
  //   searchData.length > 0
  //     ? searchData.reduce((largest, current) => {
  //         return current.amount > largest.amount ? current : largest;
  //       }, searchData[0])
  //     : null;

  //Average expense
  // const averageExpense =
  //   searchData.length > 0 ? totalSpent / searchData.length : 0;

   //Frequent expense
    const frequentCat ={};
    searchData.forEach(({spending})=>{
      frequentCat[spending]=
      (frequentCat[spending] || 0) + 1
    })
    let mostFrequent=null;
    Object.entries(frequentCat).forEach(([category,count])=>{
      if(!mostFrequent) {
        mostFrequent = {
          category,count
        };
      }
      else if (count > mostFrequent.count) {
        mostFrequent = {
          category,count
        };
      }
    });

    // Highest spending Day
    const dailySpending={}
    searchData.forEach(({date,amount})=>{
      const day = new Date(date).toISOString().split("T")[0]
      // since our database stores date in full we have to convert it into (2026-07-22)
      dailySpending[day]=(dailySpending[day] || 0) + amount
    })
    let highestDay=null;
     Object.entries(dailySpending).forEach(([day,total])=>{
      if(!highestDay){
        highestDay={
          day,total
        }
      }else if(total > highestDay.total){
        highestDay={
          day,total
        }
      }
     })
    // Object.entries(highestDay).forEach(([day,total])=>{
    //   if(!highestDay) {
    //     highestDay={
    //       day,total
    //     }
    //   }
    //   else if(total > highestDay.total){
    //     highestDay={
    //       day,total
    //     }
    //   }
    // })
    

    // console.log("Your totals are:",highestDay)
  // largest=stores the largest transaction so far.It starts with the first one.
  // current=new expenses added are thrown into the loop and compared,if the current is larger than the largest,then replace largest.
  //

  const currentMonth = new Date(selectedMonth + "-01").toLocaleString("en-KE", {
    month: "long",
    year: "numeric",
  });

  const percentUsed = latestLimit > 0 ? (budgetSpent / latestLimit) * 100 : 0;

  const catTotals = {};
  searchData.forEach(({ spending, amount }) => {
    catTotals[spending] = (catTotals[spending] || 0) + amount;
  });
  
  const catList = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const maxCat = catList[0]?.[1] || 1;
  const recent = searchData.slice(0, 6);
  const dailyTotals = {};
  // console.log("our full recent",recent)

  searchData.forEach(({ date, amount }) => {
    const day = new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    dailyTotals[day] = (dailyTotals[day] || 0) + amount;
  });
  const trendData = Object.entries(dailyTotals)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([date, amount]) => ({
      date,
      amount,
    }));

  // username from first record,if available
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || "";
  // console.log("your dashboard username:",user)

  // UI

  return (
    <div>
      {showTutorial && (
        <Tutorialmodel
          username={username}
          onClose={() => setShowTutorial(false)}
        />
      )}
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
            {/* <h2>Your Average expense {averageExpense.toLocaleString("en-KE",{maximumFractionDigits:0,})}</h2> */}
            {username && <p style={S.subtitle}>Welcome back,{username} </p>}

            <div style={S.toggleWrap}>
              {["month", "all"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={
                    view === v ? { ...S.btnBase, ...S.btnActive } : S.btnBase
                  }
                >
                  {v === "month" ? "This month" : "All time"}
                </button>
              ))}
            </div>

            {/* <div style={S.monthSelector}>
              <button style={S.monthButton} onClick={goToPreviousMonth}>
                ◀
              </button>

              <h3 style={S.monthTitle}>{displayMonth}</h3>

              <button style={S.monthButton} onClick={goToNextMonth}>
                ▶
              </button>
            </div> */}
            {/* We wrapped our selector in a view block and it is set ,if the user clicks (this month)-->the selector is displayed,(All time)-->the selector disappears */}
            {view === "month"  && (
              <div style={S.monthSelector}>
                <button style={S.monthButton} onClick={goToPreviousMonth}>
                  ◀
                </button>

                <h3 style={S.monthTitle}>{displayMonth}</h3>
                <button style={S.monthButton} onClick={goToNextMonth}>
                  ▶
                </button>
              </div>
            ) }
            <input
              type="text"
              placeholder="🔍 Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={S.searchInput}
            />

            <p style={S.periodText}>
              {view === "month"
                ? `Showing expenses for ${currentMonth}`
                : `Showing all ${searchData.length} recorded transactions`}
            </p>
          </div>
        </div>

        {/* <div>
          <h2>{largestExpense.amount}</h2>
        </div> */}
        {view === 'month' ?(
          <>
          {latestLimit > 0 && percentUsed >= 80 && percentUsed < 100 && (
          <div
            style={{
              background: "#3d2d00",
              color: "#facc15",
              padding: "14px",
              borderRadius: "10px",
              marginBottom: "16px",
              border: "1px solid #ca8a04 ",
              fontWeight: "500",
            }}
          >
            ⚠️ You have used {Math.round(percentUsed)}% of your current budget.
            Spend carefully!
          </div>
        )}

        {latestLimit > 0 && percentUsed >= 100 && (
          <div
            style={{
              background: "#3b0d0d",
              color: "#f87171",
              padding: "14px",
              borderRadius: "10px",
              marginBottom: "16px",
              border: "1px solid #dc2626",
              fontWeight: "600",
            }}
          >
            🚨 Current Budget exceeded! You've spent KSh{" "}
            {budgetSpent.toLocaleString()} out of KSh{" "}
            {latestLimit.toLocaleString()}.
          </div>
        )}

        {/* our update banner */}
        {updateBanner &&(
          <div style={S.updateBanner}>
            <div>
              <div style={S.updateTitle}>
               🎉 What's new in Pesa Wazi
              </div>

              <div style={S.updateText}>
                We've changed the look of the All Time page,and made it easier to understand and manage your finances.
                 <br/>
                 <br/>
                 • 🔍 Search your transactions
                 <br/>
                 • 📊 All time spending analytics
                 <br/>
                 • 📆 Monthly spending history
              </div>
            </div>

            <button style={S.updateButton} onClick={()=>{
              localStorage.setItem("pesaWaziUpdateV1_1", "seen")
              setUpdateBanner(false)}}>Got it</button>
              {/* so when user clicks the button, it is saved in localstorage that this update was seen for this version. Hide the banner as well */}

          </div>
        )}

        {/* metric cards */}
        <div
          style={S.metricsGrid}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {[
            {
              label: "Spent this month",
              value: fmt(totalSpent),
              sub: `${filtered.length} transactions`,
              color: "#f87171",
            },
            {
              label: "Current Budget",
              value: fmt(latestLimit),
              sub: budget
                ? `${new Date(budget.start_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })} → ${new Date(budget.end_date).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )}`
                : "No active budget",
              color: "#e2e8f0",
            },

            {
              label: "Budget Spent",
              value: budget ? fmt(budgetSpent) : "--",
              sub: budget ? "Current budget period" : budgetStatus,
              color: budget ? "#f59e0b" : "#6b7280",
            },
            {
              label: "Remaining",
              value: fmt(remaining),
              sub: "available",
              color: remaining >= 0 ? "#4ade80" : "#f87171",
              border:
                percentUsed >= 100
                  ? "#dc2626"
                  : percentUsed >= 80
                    ? "#facc15"
                    : "#1f2535",
            },
            {
              label: "Categories",
              value: catList.length,
              sub: "spending areas",
              color: "#e2e8f0",
            },
          ].map(({ label, value, sub, color, border }) => (
            <div
              key={label}
              style={{
                ...S.metricCard,
                border: `1px solid ${border || "#1f2535"}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={S.metricLabel}>{label}</div>
              <div style={{ ...S.metricValue, color }}>{value}</div>
              <div style={S.metricSub}>{sub}</div>
            </div>
          ))}
        </div>

        {/* our pie chart */}
        <div style={S.grid2}>
          <div style={S.card}>
            <div style={S.cardTitle}>Spending By Category</div>

            <CategoryPieChart data={catList} />
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>Monthly Spending Trend</div>

            <MonthlyTrend data={trendData} />
          </div>
        </div>

        {/* recent transactions */}
        <div
          style={S.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={S.cardTitle}>Recent transactions</div>
          {recent.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "13px" }}>
              No transactions for this period.
            </p>
          ) : (
            recent.map((item, index) => (
              <div
                key={index}
                style={
                  index === recent.length - 1
                    ? { ...S.txnRow, borderBottom: "none" }
                    : S.txnRow
                }
              >
                <div>
                  <div style={S.txnName}>{item.spending}</div>
                  {/* same format as your original: new Date().toLocaleDateString() */}
                  <div style={S.txnDescription}>
                    {item.description || "No description"}
                  </div>
                  <div style={S.txnDate}>
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <div style={S.txnAmt}>-{item.amount.toLocaleString()}</div>
              </div>
            ))
          )}
        </div>

        {/* charts row */}
        <div style={S.grid2}>
          <div
            style={S.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={S.cardTitle}>Spending by category</div>
            {catList.map(([cat, amt]) => (
              <SpendingBar key={cat} cat={cat} amount={amt} max={maxCat} />
            ))}
          </div>
          <div
            style={S.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={S.cardTitle}>Current Budget progress</div>
            {budget && (
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                {new Date(budget.start_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
                {" → "}
                {new Date(budget.end_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </div>

              // progress bar for budget
            )}

            <div style={S.progressTrack}>
              <div
                style={{
                  ...S.progressFill,
                  width: `${percentUsed}%`,
                  background:
                    percentUsed >= 100
                      ? "#ef4444"
                      : percentUsed >= 80
                        ? "#f59e0b"
                        : "#22c55e",
                }}
              ></div>
            </div>
          </div>
        </div></>
        
        //All time dashboard 
        ):(
          <>
          <div style={S.sectionTitle}>
            Lifetime Financial Overview</div>

            <p>A summary of your spending since you started using Pesa Wazi.</p>
          {/* metric cards */}
        <div
          style={S.metricsGrid}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {[
            {
              label: "lifetime spending",
              value: allTimeSummary
              ? fmt(allTimeSummary.total_spent)
              :"--",
              sub: "Since you joined Pesa Wazi",
              color: "#60a5fa",
            },
            // total transactions
            {
              label: "Total Transaction",
              value: allTimeSummary
              ? allTimeSummary.total_transactions
              :"--",
              // sub:`${allTimeSummary.transaction_count}transactions`,
              color: "#e2e8f0",
            },
            // largest expense
            {
              label: "Biggest Expense",
              value: allTimeSummary ? fmt(allTimeSummary.largest_expense.amount) : "--",
              // sub: allTimeSummary. ? allTimeSummary.largest_expense.description : "",
              color: "#f59e0b" 
            },

            // Average expense
            {
              label: "Average Expense",
              value: allTimeSummary  ? fmt(allTimeSummary.average_expense) :"--",
              sub: "",
              color: "#68b741",               
            },

            // Frequent category
            {
              label: "Favourite category",
              value: allTimeSummary ? allTimeSummary.frequent_category.spending :"--",
              sub: allTimeSummary
              ?`Used in ${allTimeSummary.frequent_category.frequent_cat}transactions`:"",
              color: "#e2e8f0",
            },
          ].map(({ label, value, sub, color, border }) => (
            <div
              key={label}
              style={{
                ...S.metricCard,
                border: `1px solid ${border || "#1f2535"}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={S.metricLabel}>{label}</div>
              <div style={{ ...S.metricValue, color }}>{value}</div>
              <div style={S.metricSub}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Table of spending */}
        <h3 style={S.sectiontitle}> Monthly Spending History</h3>

        <table style={S.table}>
          <thead style={S.tableHead}>
            <tr>
              <th style={S.tableHeaderCell}>Month</th>
              <th style={S.tableHeaderCell}>Total Spent</th>
            </tr>
          </thead>

          <tbody>
            {monthlyHistory.map((item)=>(
              <tr key={item.month}
               onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1e293b")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
            }>
                <td style={S.tableCell}>{item.month}</td>
                <td style={S.tableCell}>{fmt(item.total_spent)}</td>
              </tr>
            ))}
          </tbody>

        </table>
      

          
            </>
        )}


          
      </div>
    </div>
  );
};

export default Dashboard;

const S = {
  updateBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "18px 20px",
    marginBottom: "25px",
    borderRadius: "14px",
    background: "#111827",
    border: "1px solid #1f2937"
  },
  updateTitle:{
    color: "#2dd12d",
    fontSize: "17px",
    fontWeight: "600",
    marginBottom: "6px"
  },
  updateText:{
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  updateButton:{
    padding: "9px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    whitespace: "nowrap",
  },

  tableContainer :{
    marginTop: "30px",
    background:"#0f172a",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #1f2937",
    overflow: "auto",
  },

  table:{
    width: "100%",
    borderCollapse:"collapse",
    color: "#e5e7eb",
  },
  tableHeaderCell:{
    padding : "14px",
    textAlign: "left"
  },
  tableCell:{
    padding: "14px",
    fontSize: "14px",
    color: "#d1d5db",
  },
  sectiontitle:{
    marginTop: "35px",
    marginBottom: "15px",
    color : "#f8fafc",
    fontSize: "22px",
    fontWeight: "600",
  },
  tableHead:{
    background: "#111827",
  },
  noBudgetProgress:{
    height: "18px",
    borderRadius: "999px",
    background: "#374151",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#9ca3af",
    fontSize: "13px",
    fontWeight: "600"

  },
  insightDate: {
    marginTop: "10px",
    color: "#9ca3af",
    fontSize: "14px",
  },
  insightsSection: {
    marginTop: "50px",
  },

  sectionTitle: {
    color: "white",
    marginBottom: "20px",
    fontSize: "30px",
  },

  insightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "22px",
  },

  insightCard: {
    background: "#1f2937",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #374151",
    cursor: "pointer",
    transition: "0.25s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },

  insightLabel: {
    color: "#9ca3af",
    marginBottom: "12px",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  insightValue: {
    color: "#22c55e",
    fontSize: "30px",
    margin: 0,
    fontWeight: "bold",
    marginBottom: "10px",
  },

  insightSub: {
    color: "white",
    marginTop: "10px",
    fontWeight: "bold",
  },

  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0f1117",
    minHeight: "100vh",
    color: "#e8e8e8",
    padding: "1rem",
  },
  topbar: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "stretch" : "flex-start",
    justifyContent: "space-between",
    marginBottom: "1.75rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  h1: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: "3px",
  },
  subtitle: { fontSize: "13px", color: "#6b7280" },
  toggleWrap: {
    display: "flex",
    gap: "6px",
    width: isMobile ? "100%" : "auto",
  },

  btnBase: {
    flex: isMobile ? 1 : "unset",
    textAlign: "center",
    fontSize: "12px",
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid #2a2d36",
    background: "transparent",
    color: "#9ca3af",
    cursor: "pointer",
  },
  btnActive: {
    background: "#1e2130",
    color: "#ffffff",
    border: "1px solid #3b4060",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "10px",
    marginBottom: "1.25rem",
  },
  metricCard: {
    background: "#161b27",
    border: "1px solid #1f2535",
    borderRadius: "12px",
    padding: "16px 18px",
    transition: "transform .25s ease, box-shadow .25s ease",
  },
  metricLabel: {
    fontSize: "11px",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    marginBottom: "8px",
  },
  metricValue: { fontSize: isMobile ? "18px" : "22px", fontWeight: 600 },
  metricSub: { fontSize: "11px", color: "#6b7280", marginTop: "4px" },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "10px",
  },
  card: {
    background: "#161b27",
    border: "1px solid #1f2535",
    borderRadius: "12px",
    padding: isMobile ? "1rem" : "1.25rem",
  },
  cardTitle: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    marginBottom: "1rem",
  },
  spendRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  spendLabel: {
    fontSize: "13px",
    color: "#c9d0dc",
    width: "100px",
    flexShrink: 0,
  },
  barWrap: {
    flex: 1,
    height: "6px",
    background: "#1e2333",
    borderRadius: "3px",
    overflow: "hidden",
  },
  spendAmt: {
    fontSize: "12px",
    color: "#6b7280",
    width: "70px",
    textAlign: "right",
    flexShrink: 0,
  },
  txnRow: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    justifyContent: "space-between",
    padding: "9px 0",
    borderBottom: "1px solid #1e2535",
  },
  txnName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#e2e8f0",
    marginBottom: "2px",
  },
  txnDate: { fontSize: "11px", color: "#6b7280" },
  txnAmt: { fontSize: "13px", fontWeight: 600, color: "#f87171" },
  txnDescription: {
    color: "#9ca3af",
    fontSize: "13px",
    fontStyle: "italic",
    marginTop: "2px",
  },
  budgetRow: { marginBottom: "14px" },
  budgetTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginBottom: "6px",
  },
  budgetBarWrap: {
    height: "6px",
    background: "#1e2333",
    borderRadius: "4px",
    overflow: "hidden",
  },
  legendWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "10px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "#9ca3af",
  },
  legendDot: {
    width: "9px",
    height: "9px",
    borderRadius: "2px",
    flexShrink: 0,
  },
  canvasWrap: { position: "relative", width: "100%", height: "180px" },
  // status banners
  loadBanner: {
    background: "#1e2130",
    border: "1px solid #2a2d36",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#9ca3af",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  errBanner: {
    background: "#1f1217",
    border: "1px solid #5b2020",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#f87171",
    marginBottom: "1rem",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid #3b4060",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  },
  periodText: {
    fontSize: "13px",
    color: "#17f00b",
    marginTop: "10px",
  },

  monthSelector: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  monthTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#ffffff",
    minWidth: "150px",
    textAlign: "center",
  },

  monthButton: {
    background: "#1e2130",
    color: "#fff",
    border: "1px solid #2d3348",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "16px",
  },
  progressTrack: {
    width: "100%",
    height: "14px",
    background: "#1f2535",
    borderRadius: "999px",
    overflow: "hidden",
    marginTop: "12px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },
  searchInput: {
    width: "100%",
    maxWidth: "420px",
    padding: "12px 16px",
    marginTop: "20px",
    borderRadius: "20px",
    border: "1px solid  #374151 ",
    background: "#111827",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
  },
};
