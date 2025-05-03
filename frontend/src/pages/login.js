
"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import loginimage from "../images/icon4.avif"
import "../css/login.css"

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/api/v1/login/", { email, password })
      localStorage.setItem("userId", response.data.userId)
      localStorage.setItem("userRole", response.data.role) // Store role for future use

       localStorage.setItem("token", response.data.token);

       
      navigate(response.data.redirect)
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message)
      } else {
        console.error("Login failed:", error.message)
      }
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-content">
        <div className="login-form-section">
          <h1>EthioAce</h1>
          {errorMessage && <p className="login-error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>
            <div className="options">
              <label>
                <input type="checkbox"/><p>&nbsp;Remember_me</p>
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Login</button>
          </form>
          <p>
            Not registered yet? Create an account as a <a href="/signup">student</a> 
            
          </p>
        </div>
        <div className="login-image-section">
          <img src={loginimage || "/placeholder.svg"} alt="Description of the image" />
        </div>
      </div>
    </div>
  )
}

export default Login

