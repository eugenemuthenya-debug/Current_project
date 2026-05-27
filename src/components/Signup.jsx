import { useState } from "react"
import Navbar from "./Navbar"
import axios from "axios"

const Signup=()=>{
  // our hooks for user data
  const[username,setUser]=useState()
  const[email,setEmail]=useState()
  const[password,setPassword]=useState()
  const[phone,setPhone]=useState()

  const baseUrl="https://financial-backend-ps2l.onrender.com/api"

  // for our communication with the user
  const[error,setError]=useState()
  const[loading,setLoading]=useState()
  const[success,setSuccess]=useState()

  const submit=async (e)=>{
    // we prevent the page reloding
    e.preventDefault()
    // clear other messages
     setError("")
     setSuccess("")
     setLoading("")

    //  our request is sent
    const response=await axios.post(baseUrl + "/signup")
    
  }

  return(
    <div>
      <Navbar/>
      <div>
        <form onSubmit={submit}>
          {/* username */}
          <div >
            <label>Username</label>
            <input 
          type="text" 
          required 
          placeholder="your name" 
          className="sup-input"
          value={username} 
          onChange={(e)=> setUser(e.target.value)}/>

          </div>
          {/* email */}
          <div>
            <label>Email</label>
            <input 
            type="email"
            required
            placeholder="you@gmail.com"
            className="sup-input"
            value={email}
            onChange={(e)=>setEmail(e.target.value)} />

          </div>
          {/* password */}
          <div>
            <label>Password</label>
            <input 
          type="text"
          required
          placeholder="••••••••"
          className="sup-input"
          value={password}
          onChange={(e)=>setPassword(e.target.value)} />
          
          </div>
          {/* phone */}
          <div>
            <label>Phone</label>
            <input
            type="phone"
            required
            placeholder="0712345678"
            className="sup-input"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}/>
          </div>


        </form>
      </div>
    </div>
  )

}

export default Signup