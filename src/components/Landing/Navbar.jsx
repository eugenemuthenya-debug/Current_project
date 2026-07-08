import { Link } from "react-router-dom"

const LandingNavbar=()=>{
    return(
        <nav style={S.nav}>
            <div style={S.logo}>
                 ₿ PESA WAZI
            </div>
            <div style={S.links}>
                <Link to={"/signin"} style={S.login}>Sign In</Link>
                <Link to={"/signup"} style={S.signup}>Sign Up</Link>
            </div>
        </nav>
    )
}

const S={
     nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "#010612",
  },

  logo: {
    color: "white",
   fontSize:"clamp(2rem,4vw,2.4rem)",
    fontWeight: "bold",
  },

  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  login: {
    color: "white",
    textDecoration: "none",
  },

  signup: {
    background: "#227cc5",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
  },
};
export default LandingNavbar
