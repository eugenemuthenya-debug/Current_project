import { useNavigate } from "react-router-dom"

const Action=()=>{
    const navigate=useNavigate()
    return(
        <section className="Action-section" style={S.section}>
            <h2 style={S.heading}>
                Ready to Take Control of Your Finances?
            </h2>

            <p style={S.text}>
                Join other users who are building better financial habits with Pesa Wazi.
            </p>

            <button style={S.button}
            onClick={() => navigate("/signup")}
        onMouseEnter={(e)=>{
          e.currentTarget.style.transform="translateY(-3px)";
          e.currentTarget.style.boxShadow="0 12px 30px rgba(34,197,94,.35)";
        }}
        onMouseLeave={(e)=>{
          e.currentTarget.style.transform="translateY(0)";
          e.currentTarget.style.boxShadow="none";
        }}
            >
                Start Your Pesa Wazi Journey
                
            </button>
            <p style={S.smallText}>No credit card required . Free to get started</p>

        </section>

    )
}
const S={
    section:{
padding:"100px 40px",
background:"#22c55e",
textAlign:"center",
},

heading:{
fontSize:"clamp(2.5rem,5vw,3.3rem)",
color:"white",
marginBottom:"20px",
},

text:{
maxWidth:"700px",
margin:"0 auto",
fontSize:"clamp(1rem,2vw,1.15rem)",
lineHeight:1.8,
color:"#ecfdf5",
},

button:{
marginTop:"45px",
padding:"18px 40px",
fontSize:"clamp(0.95rem,1.8vw,1.1rem)",
fontWeight:"bold",
background:"white",
color:"#16a34a",
border:"none",
borderRadius:"12px",
cursor:"pointer",
transition:"0.3s",
},

smallText:{
marginTop:"25px",
color:"#dcfce7",
fontSize:"clamp(1rem,2vw,1.15rem)",
}

}
export default Action