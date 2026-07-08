import { useNavigate } from "react-router-dom";

const Hero= ()=>{
    const navigate=useNavigate()
    return(
        <section className="Hero-section" style={S.hero}>
            

            <div className="Hero-left" style={S.left}>
                <h1 style={S.title}>Know where every shilling goes</h1>

                <p style={S.subtitle}>
                    This is your financial wallet,you can track your expenses,create budgets and understand your spending habit with simple visual reports.
                </p>

                 <div style={S.buttons}>
                    <button style={S.primaryButton} onClick={()=>navigate("/signup")}>Get Started</button>
                 <button style={S.secondaryButton}>Learn More</button>
                 </div>

            </div>

            <div className="Hero-right" style={S.right}>
                <div style={S.placeholder}>
                    Dashboard Screenshot
                </div>

            </div>
            

            {/* <h2>Know where every shilling goes.</h2>

            <p>
                
            </p>

            */}
        </section>
    )
}


const S = {
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "80vh",
    padding: "40px 20px",
    background: "#111827",
    color: "white",
  },

  left: {
    flex:1,
    minWidth: "320px",
  },

  right: {
    flex:1,
    minWidth: "320px",
    display: "flex",
    justifyContent: "center",
  },

  title: {
    fontSize: "52px",
    marginBottom: "20px",
    lineHeight: 1.2,
  },

  subtitle: {
    fontSize: "20px",
    color: "#cbd5e1",
    lineHeight: 1.7,
    marginBottom: "30px",
  },

  buttons: {
    display: "flex",
    gap: "20px",
  },

  primaryButton: {
    padding: "14px 28px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondaryButton: {
    padding: "14px 28px",
    background: "transparent",
    color: "white",
    border: "2px solid white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  placeholder: {
    width:"100%",
    maxwidth: "380px",
    height: "260px",
    background: "#1f2937",
    border: "2px dashed #4b5563",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#9ca3af",
  },
};
export default Hero

// Hero-->is the first page the user sees when they visit most websites/landing page
// Section-->tells browser its an important section of the page