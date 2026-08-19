import api from "../api/axiosInstance"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"



const Verifyemail=  ()=>{
    const [loading,setLoading]=useState("")
    const [success,setSuccess]=useState("")
    const [error,setError]=useState("")
    const navigate=useNavigate()
    const location=useLocation()
    const [focused,setFocused]=useState(false)
    // useLocation-->allows you to receive data passed from another page

    // Data tht we need
    const [code,setCode]=useState("")
    // const baseUrl="https://financial-backend-ps2l.onrender.com/api"

    const email=location.state?.email || localStorage.getItem("verification_email")

    // now we submit since we are moving with our email
    const submit = async (e)=>{
        e.preventDefault()
        // clear old messages
        setError("")
        setSuccess("")
        // show loading
        setLoading("Verifying your email...")
        // send request to flask
       try {
      const response = await api.post("/verify-email", {
        email,
        code,
      })
      // console.log("Email is",email)

      setSuccess(response.data.message)

      setTimeout(() => {
        navigate("/signin")
      }, 2000)

    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading("")
    }
  }

  // if (!email) {
  //   return <p>No email found. Please sign up again.</p>
  // }
    
    const resendCode= async ()=>{
      setError("")
      setSuccess("")
      setLoading("Sending new verification code...")

      try{
        const response = await api.post("/resend-verification",
        {email}
      )
      setLoading("")
      setSuccess(response.data.message)

      }
      
      catch(error){
        setLoading("")
        setSuccess("")
        if (error.response && error.response.data) {
        setError(error.response.data.error || "Verification code not sent")

      }
      else{
        setError(error.message)
      }
    }

    }

    
    

    return (
      <div style={{
        minHeight:"100vh",
        background:"#0f1117",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:"20px"
      }}>
        <div style={{
          width:"100%",
          maxWidth:"500px",
          background:"#161b27",
          border:"1px solid #2b3244",
          borderRadius:"18px",
          padding:"40px",
          color:"#e2e8f0",
          textAlign:"center",
          boxShadow:"0 25px 60px rgba(0,0,0,.4)"
        }}>
          <h2 style={{
            fontSize:"30px",
            marginBottom:"10px"
          }}>📧 Verify Email</h2>

        <p style={{
          color:"#9ca3af",
          lineHeight:"1.7"
        }}>
          Enter the 6 digit code sent to:
          <br/><br/>
          <strong style={{
            color:"#ffffff"
          }}> {email}</strong>
        </p>

        <h5 className="text-danger">{error}</h5>
        <h5 className="text-success">{success}</h5>
        <h5 className="text-info">{loading}</h5>

        <form onSubmit={submit}>
          <input
            type="text"
            maxLength="6"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g,""))}
            autoFocus
            onFocus={()=> setFocused(true)}
            onBlur={()=> setFocused(false)}
            style={{
              width:"100%",
              padding:"16px",
              marginTop:"25px",
              marginBottom:"25px",
              background: "#0f1117",
              border: 
              focused
              ? "2px solid #2563eb"
              : "2px solid #2b3244",
              borderRadius:"12px",
              boxShadow: focused
              ?"0 0 12px rgba(37,99,235,.35)"
              :"none",
              color: "#ffffff",
              fontSize:"28px",
              letterSpacing:"12px",
              textAlign:"center",
              outline:"none",
               transition: "border-color .2s ease"

            }}
          />

          <br />

          <button type="submit" 
          disabled={loading}
          style={{
            width:"100%",
            padding:"14px",
            background:loading
            ? "#4b5563"
            : "#4b5563",
            color:"white",
            border:"none",
            borderRadius:"12px",
            cursor:loading
            ?"not-allowed"
            : "pointer",
            fontSize:"16px",
            fontWeight:"600",
            transition:"all .2s ease"
          }}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
        <p>Didn't receive code?{" "}
          
          <button type="button"
           style={{
           background:"none",
           border:"none",
           color:"#3b82f6",
           cursor:"pointer",
           padding:0,
           fontWeight:"600"
           }}
          onClick={resendCode}>Resend code</button>
        </p>

        
        <p>Already have an account {" "}
           <span
           onClick={()=>navigate("/signin")}
           style={{
            color:"#3b82f6",
            cursor:"pointer",
            fontWeight:"600",
            marginLeft:"6px"
           }}
           >
           Sign In
         </span>
        </p>

        <br/>
        <p>
          Wrong email? {" "}
            <span
            onClick={()=>navigate("/signin")}
            style={{
            color:"#3b82f6",
            cursor:"pointer",
            fontWeight:"600",
            marginLeft:"6px"
           }}
           >
            Back to Sign Up
          </span>
        </p>
        </div>
      </div>
    );

}

export default Verifyemail