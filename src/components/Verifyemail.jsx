import api from "../api/axiosInstance"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"



const Verifyemail=  ()=>{
    const [loading,setLoading]=useState("")
    const [success,setSuccess]=useState("")
    const [error,setError]=useState("")
    const navigate=useNavigate()
    const location=useLocation()
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
      setLoading(false)
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
      <div className="container mt-5">
        <h2>Verify Email</h2>

        <p>
          Enter the 6 digit code sent to:
          <strong> {email}</strong>
        </p>

        <h5 className="text-danger">{error}</h5>
        <h5 className="text-success">{success}</h5>
        <h5 className="text-info">{loading}</h5>

        <form onSubmit={submit}>
          <input
            type="text"
            maxLength="6"
            className="form-control"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <br />

          <button type="submit" className="btn btn-primary">
            Verify
          </button>
        </form>
        <p>Didn't receive code?{" "}
          <br/>
          <button type="button" className="btn btn-primary" onClick={resendCode}>Resend code</button>
        </p>

        <br/>
        <p>Already have an account {" "}
          <button type="button" className="btn btn-primary" onClick={()=>navigate("/signin")}>Back to sign in</button>
        </p>

        <br/>
        <p>
          Wrong email? {" "}
          <button type="button" className="btn btn-primary" onClick={()=>navigate("/signup")}>Back to sign up</button>
        </p>
      </div>
    );

}

export default Verifyemail