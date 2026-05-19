import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

// main function component
const Signup = () => {

  // hooks using (useState) that will be updated later in the program and are used to detect change in thespecific field when user interact with the ui and stores them in fields fro later updates.
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email,    setEmail]    = useState("")
  const [phone,    setPhone]    = useState("")

  // navigate function-->directs you to signin after creating your account
  const navigate = useNavigate()
  // incase we change our endpoint
  const baseUrl="https://financial-backend-ps2l.onrender.com/api"

  // messages for interactivity to remain with user
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState("")
  const [success, setSuccess] = useState("")

  // ── Password strength checker ──────────────────────────────────────────────
  // 1. function that checks password against 5 rules and returns true/false for each
  // we pass pwd as our parameter and return an object with 5 properties
  // pwd-->this is wht the user is typing as their password and this is what will be tested.
  const checkPassword = (pwd) => ({
    length:    pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number:    /[0-9]/.test(pwd),
    special:   /[^A-Za-z0-9]/.test(pwd),
  })
  // (//)-->we use this in regex since it is a pattern matcher.
  //if we use "" it will be treated as a plain text and not a pettern matcher
  // we can also call .test() method thnx to those // and pass wht we wanna test as a parameter and it returns true or false.
  // okay,since pwd is our users assword,each test it goes,th e result will either be true or false depending if it matcheds the pattern set fo it.

  // 2. call the function — react re-runs this every time password changes
  const pwdChecks = checkPassword(password)

  // 3. count how many checks pass (0-5)
  // Object.values → array of true/false → filter keeps only true,from the list of true/flase values from the object → count them
  // our object comes as key calue pair(length,true)when we use object.values(we only want the values=true/flase).
  const pwdStrength = Object.values(pwdChecks).filter(Boolean).length

  // 4. label and color based on score
  // from pwdstrength--> we have our array of true or false values .
  const strengthLabel = pwdStrength <= 1 ? "Weak"
    : pwdStrength <= 3 ? "Fair"
    : pwdStrength <= 4 ? "Good"
    : "Strong"

  const strengthColor = pwdStrength <= 1 ? "#f87171"
    : pwdStrength <= 3 ? "#f59e0b"
    : pwdStrength <= 4 ? "#60a5fa"
    : "#4ade80"

  // ── Submit function ────────────────────────────────────────────────────────
  const submit = async (e) => {
    // prevents the webpage from reloading after submitting form content
    e.preventDefault()

    // clear old messages first
    setSuccess("")
    setError("")

    // 1. check password strength first
    if (pwdStrength < 3) {
      setError("Please choose a stronger password")
      return
    }

    // 2. validate kenyan phone number
    // /^/ --> start of string
    // \+254|254|0 --> allows number to start with (+254 / 254 / 0)
    // 7\d|1\d --> ensures number after prefix is 7 or 1
    const phoneRegex = /^(?:\+254|254|0)(?:7\d|1\d)\d{7}$/
    if (!phoneRegex.test(phone)) {
      setError("Enter a valid Kenyan number e.g. 0712345678 or +254712345678")
      return
    }

    // 3. only then start loading
    setLoading("Wait as you get registered...")

    // try...catch --> incase there is an error, the app doesn't crash
    try {
      // axios --> library that helps make HTTP requests to our API
      // await --> waits for response before continuing
      const response = await axios.post(baseUrl +  "/signup",
        
        { username, email, phone, password }
      )

      setLoading("")
      // catches the success message from flask and displays it
      setSuccess(response.data.message)

      // clear form after successful submission
      setUsername("")
      setEmail("")
      setPhone("")
      setPassword("")

      // redirect to login after 2 seconds — gives user time to read success message
      setTimeout(() => navigate("/signin"), 2000)

    } catch (error) {
      setSuccess("")
      setLoading("")
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Signup failed")
      } else {
        setError("Network error. Please check your connection")
      }
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }

        .sup-input {
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
        .sup-input::placeholder { color: #4b5563; }
        .sup-input:focus { border-color: #3b4060; }

        .sup-btn {
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
        .sup-btn:hover:not(:disabled) { background: #1a6dbf; }
        .sup-btn:disabled { opacity: .6; cursor: not-allowed; }

        .sup-link { color: #6366f1; text-decoration: none; }
        .sup-link:hover { text-decoration: underline; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sup-card { animation: fadeUp .3s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Navbar />

      <div style={S.center}>
        <div style={S.card} className="sup-card">

          {/* Logo mark */}
          <div style={S.logoWrap}>
            <span style={S.logo}>₿</span>
          </div>

          <h2 style={S.title}>Create your account</h2>
          <p style={S.subtitle}>First time user? Sign up below</p>

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
          <form onSubmit={submit} style={{ marginTop: "1.5rem" }}>

            {/* Username */}
            <div style={S.field}>
              <label style={S.label}>Username</label>
              <input
                type="text"
                placeholder="your name"
                required
                className="sup-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <div style={S.field}>
              <label style={S.label}>Email</label>
              <input
                type="email"
                placeholder="you@gmail.com"
                required
                className="sup-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone — restricted to numbers only */}
            <div style={S.field}>
              <label style={S.label}>Phone</label>
              <input
                type="tel"
                placeholder="0712345678"
                required
                className="sup-input"
                value={phone}
                maxLength={13}
                onChange={(e) => {
                  setPhone(e.target.value)
                }}
              />
            </div>

            {/* Password */}
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="sup-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Password strength checker — only shows when user starts typing */}
              {password.length > 0 && (
                <div style={S.pwdBox}>

                  {/* Strength bar */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ flex: 1, height: "5px", background: "#1e2333", borderRadius: "3px", overflow: "hidden", marginRight: "10px" }}>
                      <div style={{
                        height: "100%", borderRadius: "3px",
                        background: strengthColor,
                        width: `${(pwdStrength / 5) * 100}%`,
                        transition: "width .3s ease, background .3s ease"
                      }} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>

                  {/* Requirements list — loops through 5 rules */}
                  {[
                    { key: "length",    label: "At least 8 characters" },
                    { key: "uppercase", label: "One uppercase letter (A–Z)" },
                    { key: "lowercase", label: "One lowercase letter (a–z)" },
                    { key: "number",    label: "One number (0–9)" },
                    { key: "special",   label: "One special character (!@#$...)" },
                  ].map(({ key, label }) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", color: pwdChecks[key] ? "#4ade80" : "#4b5563" }}>
                        {pwdChecks[key] ? "✓" : "○"}
                      </span>
                      <span style={{
                        fontSize: "12px",
                        color: pwdChecks[key] ? "#9ca3af" : "#4b5563",
                        textDecoration: pwdChecks[key] ? "line-through" : "none"
                      }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="sup-btn"
              disabled={!!loading}
              style={{ marginTop: "0.5rem" }}
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>

          </form>

          <p style={S.footer}>
            Already registered?{" "}
            <Link to="/signin" className="sup-link">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  )
}

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
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "420px",
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
    display: "flex", alignItems: "center", gap: "8px",
    background: "#1e2130", border: "1px solid #2a2d36",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "13px", color: "#9ca3af", marginTop: "1rem",
  },
  spinner: {
    display: "inline-block", width: "13px", height: "13px",
    border: "2px solid #3b4060", borderTopColor: "#6366f1",
    borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0,
  },
  errBanner: {
    background: "#1f1217", border: "1px solid #5b2020",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "13px", color: "#f87171", marginTop: "1rem",
  },
  okBanner: {
    background: "#0f1f14", border: "1px solid #1f4d2a",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "13px", color: "#4ade80", marginTop: "1rem",
  },
  field: { marginBottom: "1rem" },
  label: {
    display: "block", fontSize: "12px", fontWeight: 500,
    color: "#9ca3af", marginBottom: "6px", letterSpacing: ".02em",
  },
  pwdBox: {
    marginTop: "8px", background: "#0f1117",
    border: "1px solid #1f2535", borderRadius: "10px",
    padding: "12px 14px",
  },
  footer: {
    textAlign: "center", fontSize: "13px",
    color: "#6b7280", marginTop: "1.5rem", marginBottom: 0,
  },
}

export default Signup