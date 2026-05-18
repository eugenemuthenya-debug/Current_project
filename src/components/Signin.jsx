import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import API from '../../api'

const Signin = () => {

  // ── states detect change when user interacts with the ui ──────────────────────────────────────────
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState("")
  const [error,    setError]    = useState("")
  // navigate is used to navigate from one page to another with or without data
  const navigate = useNavigate()
  // incase we need to change our base url from time to time we can create a function for it and call it in the submit function
  

  // ──  submit function when the user has filed the form,and when they press the submit btn,all of this is the logic behind it
  // async-->we wait for response from server as the code runs preventing crashing
  // e.preventDefault()-->it prevents the fields from refreshing─────────────────────────────── 
  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading("Please wait while we sign you in...")
    try {
      const response = await API.post("/signin",{ email: email, password: password })
        
      setLoading("")
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        navigate("/dashboard")
      }
    } catch (error) {
      setLoading("")
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Invalid login credentials")
      } else {
        setError("Network error. Please check your connection")
      }
    }
  }

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }

        .signin-input {
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
        .signin-input::placeholder { color: #4b5563; }
        .signin-input:focus { border-color: #3b4060; }

        .signin-btn {
          width: 100%;
          padding: 11px;
          background: #185FA5;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background .2s, opacity .2s;
          letter-spacing: .01em;
        }
        .signin-btn:hover:not(:disabled) { background: #1a6dbf; }
        .signin-btn:disabled { opacity: .6; cursor: not-allowed; }

        .signin-link { color: #6366f1; text-decoration: none; }
        .signin-link:hover { text-decoration: underline; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .signin-card { animation: fadeUp .3s ease; }
      `}</style>

      <Navbar />

      <div style={S.center}>
        <div style={S.card} className="signin-card">

          {/* Logo mark */}
          <div style={S.logoWrap}>
            <span style={S.logo}>₿</span>
          </div>

          <h2 style={S.title}>Welcome back</h2>
          <p style={S.subtitle}>Sign in to your account</p>

          {/* Status messages */}
          {loading && (
            <div style={S.infoBanner}>
              <span style={S.spinner} />
              {loading}
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          {error && <div style={S.errBanner}>{error}</div>}

          {/* Form fields + logic */}
          <form onSubmit={submit} style={{ marginTop: "1.5rem" }}>

            <div style={S.fieldGroup}>
              <label style={S.label}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="signin-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ ...S.fieldGroup, marginBottom: "1.5rem" }}>
              <label style={S.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="signin-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="signin-btn"
              disabled={!!loading}
            >
              {loading ? "Please wait..." : "Sign In"}
            </button>

          </form>

          <p style={S.footer}>
            Don't have an account?{" "}
            <Link to="/signup" className="signin-link">Sign up</Link>
          </p>

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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 56px)", // subtract navbar height
    padding: "2rem 1rem",
  },
  card: {
    background: "#161b27",
    border: "1px solid #1f2535",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "400px",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.25rem",
  },
  logo: {
    width: "44px",
    height: "44px",
    background: "linear-gradient(135deg, #185FA5, #6366f1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#6b7280",
    textAlign: "center",
    margin: 0,
  },
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
    marginTop: "1rem",
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
    marginTop: "1rem",
  },
  fieldGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "#9ca3af",
    marginBottom: "6px",
    letterSpacing: ".02em",
  },
  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "1.5rem",
    marginBottom: 0,
  },
}

export default Signin