import React, { useState } from "react"
import "./Login.css"
import { useNavigate } from "react-router-dom"

import illustration from "../assets/login-illustration.png"

import {Building2,ArrowLeft,UserCircle,Mail,Lock} from "lucide-react"

const Login = () => {

  const navigate = useNavigate()

  const [login, setLogin] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setLogin({
      ...login,
      [name]: value
    })
  }

  function validate() {
    let newErrors = {}

    if (login.email.trim() === "") {
      newErrors.email = "Email is required"
    }

    if (login.password === "") {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleLogin(e) {
    e.preventDefault()
    if (!validate()) return

    if (login.email === "admin@gmail.com" &&login.password === "Admin@123") {
      const admin = {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        role: "admin"
      }

      localStorage.setItem("currentUser",JSON.stringify(admin))

      navigate("/admin/dashboard")

      return
    }

    const employees = JSON.parse(localStorage.getItem("employees")) || []

    const employee = employees.find((item) =>item.email === login.email &&item.password === login.password)

    if (employee) {
      localStorage.setItem("currentUser",JSON.stringify(employee))
      navigate("/employee/dashboard")
    }

    else {
      setErrors({password: "Invalid Email or Password"})
    }

  }

  return (

    <div className="login-page">

      <div className="login-left">
        <div className="login-logo">
          <Building2 size={28} />
          <h2>LeavePro</h2>
        </div>

        <div className="login-content">
          <h1>Welcome Back!</h1>
          <p>Login to continue managing employee leaves efficiently.</p>

          <div className="login-image">
            <img src={illustration} alt=""/>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-back" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </div>

        <div className="login-card">
          <div className="login-icon">
            <UserCircle size={40} />
          </div>
          <h2>Login</h2>
          <p>Login to your account</p>

          <form className="login-form" onSubmit={handleLogin}>

            <div className="login-group">
              <label>Email</label>
              <div className="login-input">
                <Mail size={18} />
                <input type="email" name="email" placeholder="Enter Email" value={login.email} onChange={handleChange}/>
              </div>
              {
                errors.email &&
                <p className="login-error">{errors.email}</p>
              }
            </div>

            <div className="login-group">
              <label>Password</label>
              <div className="login-input">
                <Lock size={18} />
                <input type="password" name="password" placeholder="Enter Password" value={login.password} onChange={handleChange}/>
              </div>
              {
                errors.password &&
                <p className="login-error">{errors.password}</p>
              }
            </div>

            <button className="login-submit" type="submit">Login</button>

            <div className="login-footer">
              <p>Don't have an account?<span onClick={() => navigate("/signup")}>Employee Signup</span></p>
            </div>

          </form>

        </div>

      </div>

    </div>

  )
}

export default Login