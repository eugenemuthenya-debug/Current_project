import React, { useState } from 'react'
import {  Link ,NavLink } from 'react-router-dom'

const Navbar = () => {
  // ── log out ──────────────────────────────────────────
  const user = JSON.parse(localStorage.getItem("user"))
  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  }

  // ── New: mobile menu ──────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={N.nav}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .nav-link-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #9ca3af;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: background .15s, color .15s;
          white-space: nowrap;
        }
        .nav-link-item:hover { background: #1e2333; color: #ffffff; }
        .nav-link-item.active { background: #1e2333; color: #ffffff; }
        .nav-link-item.logout { color: #f87171; }
        .nav-link-item.logout:hover { background: #1f1217; color: #f87171; }
        .nav-link-item.cta {
          background: #185FA5;
          color: #ffffff !important;
          font-weight: 500;
        }
        .nav-link-item.cta:hover { background: #1a6dbf; }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: fadeDown .18s ease; }
      `}</style>

      {/* ── Brand + desktop links ─────────────────────────────────────────── */}
      <div style={N.inner}>

        {/* Logo / brand */}
        <Link to="/dashboard" style={N.brand}>
          <span style={N.brandIcon}>₿</span>
          <span>PESA WAZI</span>
        </Link>

        {/* Desktop nav links */}
        <div style={N.links}>
          {user ? (
            <>
              <span style={N.welcome}>👋 {user.username}</span>
              <NavLink to="/dashboard"    
              className={({ isActive})=>
              isActive ? "nav-link-item active" :
              "nav-link-item"}>Home</NavLink>

              <NavLink to="/addexpense"   
              className={({ isActive})=>
              isActive ? "nav-link-item active"
              :"nav-link-item"}>Add Expense</NavLink>

              <NavLink to="/addbudget" className="nav-link-item">Add Budget</NavLink>
              
              <NavLink to="/signin" onClick={logout} className="nav-link-item logout">Log out</NavLink>
            </>
          ) : (
            <>
              <Link to="/signin"  className="nav-link-item">Sign in</Link>
              <Link to="/"  className="nav-link-item cta">Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          style={N.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ ...N.bar, transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
          <span style={{ ...N.bar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...N.bar, transform: menuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
        </button>
      </div>

      {/* ── Mobile dropdown ───────────────────────────────────────────────── */}
      {menuOpen && (
        <div style={N.mobileMenu} className="mobile-menu">
          {user ? (
            <>
              <span style={N.mobileWelcome}>👋 {user.username}</span>
              <Link to="/dashboard"    className="nav-link-item" style={N.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/addexpense"   className="nav-link-item" style={N.mobileLink} onClick={() => setMenuOpen(false)}>Add Expense</Link>
              <Link to="/addbudget" className="nav-link-item" style={N.mobileLink} onClick={() => setMenuOpen(false)}>Add Budget</Link>
              <Link to="/signin" onClick={() => { logout(); setMenuOpen(false) }} className="nav-link-item logout" style={N.mobileLink}>Log out</Link>
            </>
          ) : (
            <>
              <Link to="/signin"  className="nav-link-item" style={N.mobileLink} onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/"  className="nav-link-item cta" style={N.mobileLink} onClick={() => setMenuOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────
const N = {
  nav: {
    background: "#0d1017",
    borderBottom: "1px solid #1a2030",
    position: "sticky",
    top: 0,
    zIndex: 100,
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "15px",
    letterSpacing: "-.01em",
  },
  brandIcon: {
    width: "28px",
    height: "28px",
    background: "linear-gradient(135deg, #185FA5, #6366f1)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    // hide on mobile via media query workaround
    "@media(max-width:640px)": { display: "none" },
  },
  welcome: {
    fontSize: "12px",
    color: "#6b7280",
    padding: "0 8px",
    borderRight: "1px solid #1f2535",
    marginRight: "4px",
  },
  hamburger: {
    display: "none",       // shown via inline check below
    flexDirection: "column",
    gap: "4px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
  },
  bar: {
    display: "block",
    width: "20px",
    height: "2px",
    background: "#9ca3af",
    borderRadius: "2px",
    transition: "transform .2s, opacity .2s",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 1.5rem 16px",
    borderTop: "1px solid #1a2030",
    gap: "4px",
  },
  mobileLink: {
    display: "block",
    padding: "10px 12px",
  },
  mobileWelcome: {
    fontSize: "12px",
    color: "#6b7280",
    padding: "8px 12px",
  },
}

// Show hamburger on small screens using a simple window width check
if (typeof window !== "undefined" && window.innerWidth < 640) {
  N.hamburger.display = "flex"
  N.links.display = "none"
}

export default Navbar