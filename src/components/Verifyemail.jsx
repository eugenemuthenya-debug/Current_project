import axios from "axios"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Verifyemail=  ()=>{
    const [loading,setLoading]=useState("")
    const [success,setSuccess]=useState("")
    const [error,setError]=useState("")
    const [navigate]=useNavigate()
    const [location]=useLocation
    // useLocation-->allows you to receive data passed from another page

    // Data tht we need
    const [code,setCode]=useState("")
    const baseUrl="https://financial-backend-ps2l.onrender.com/api"

    const email=location.state?.email

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
         const response= axios.post( baseUrl + "/verify-email",{
            // email,
            code
        } )
        setLoading("")
        setSuccess( response.data.message)

        // wait for redirecting
        setTimeout(()=>{navigate("/signin")},
        2000)
        navigate("/signin")

        // error handling
        
        
       } catch (error) {
        setLoading("")
        setError(error.response?.data?.error || 
        error.message)
        
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
      </div>
    );

}

export default Verifyemail