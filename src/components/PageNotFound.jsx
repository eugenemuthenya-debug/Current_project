import { backgroundColorNames } from "chalk";
import { useNavigate } from "react-router-dom";

export default function NotFound(){
    const navigate = useNavigate();


    return(
        <div style={S.page}>
            <div style={S.card}>
                <div style={S.code}>404</div>

                <h1 style={S.title}>Page not found</h1>

                <p style={S.message}>
                    Sorry,we could not find the page you're looking for.
                    It may have been moved,deleted, or the URL may be incorrect.
                </p>

                <div style={S.actions}>
                    <button style={S.backButton}
                    onClick={()=>navigate(-1)}>Go Back</button>
                    <button style={S.homeButton}
                    onClick={()=> navigate('/')}>Go to home</button>
                </div>

            </div>
        </div>
    )
}
const S = {    
page: {
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "24px",
backgroundColor: "#f5f7fb",
fontFamily: "Arial, sans-serif",
},

card: {
width: "100%",
maxWidth: "500px",
padding: "40px 28px",
textAlign: "center",
backgroundColor: "#ffffff",
borderRadius: "16px",
boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
},

code: {
fontSize: "76px",
fontWeight: "800",
color: "#2563eb",
marginBottom: "8px",
},

title: {
fontSize: "28px",
color: "#172033",
marginBottom: "12px",
},

message: {
fontSize: "16px",
lineHeight: "1.7",
color: "#64748b",
marginBottom: "28px",
},

actions: {
display: "flex",
justifyContent: "center",
gap: "12px",
flexWrap: "wrap",
},

backButton: {
padding: "12px 20px",
border: "1px solid #cbd5e1",
borderRadius: "8px",
backgroundColor: "#ffffff",
color: "#334155",
cursor: "pointer",
},

homeButton: {
padding: "12px 20px",
border: "none",
borderRadius: "8px",
backgroundColor: "#2563eb",
color: "#ffffff",
cursor: "pointer",
}
    }