import React, { useState } from "react"
import "./Signup.css"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import illustration from "../assets/signup-illustration.png"

import {Building2,ArrowLeft,UserCircle,User,Mail,Phone,Lock,Briefcase} from "lucide-react"

const Signup = () => {

  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    })

  }

  function validate() {

    let newErrors = {}

    if (employee.name.trim() === "")
      newErrors.name = "Name is required"

    if (employee.email.trim() === "")
      newErrors.email = "Email is required"

    if (employee.department === "")
      newErrors.department = "Select Department"

    if (employee.phone.trim() === "")
      newErrors.phone = "Phone Number is required"

    else if (employee.phone.length<10)
      newErrors.phone = "Enter valid 10 digit phone number"

    if (employee.password === "")
      newErrors.password = "Password is required"

    else if (employee.password.length < 8)
      newErrors.password = "Minimum 8 characters"

    if (employee.confirmPassword === "")
      newErrors.confirmPassword = "Confirm your password"

    else if (employee.password !== employee.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0

  }

  function submit(e) {
    e.preventDefault()

    if (!validate()) return

    const oldEmployees =JSON.parse(localStorage.getItem("employees")) || []

    const exist = oldEmployees.find(item => item.email === employee.email)

    if (exist) {
      setErrors({email: "Employee already exists"})
      return
    }

    const newEmployee = {
      id: Date.now(),
      employeeId: `EMP${1001 + oldEmployees.length}`,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      phone: employee.phone,
      password: employee.password,
      joiningDate: new Date().toLocaleDateString(),
      salary: 40000,
      salaryDeduction: 0,
      remainingLeaves: 12,
      usedLeaves: 0,
      warnings: 0,
      status: "Active",
      role: "employee"
    }

    oldEmployees.push(newEmployee)

    localStorage.setItem("employees",JSON.stringify(oldEmployees))

    Swal.fire({
      icon: "success",
      title: "Account Created",
      text: "Please login to continue.",
      confirmButtonColor: "#4361ee"
    }).then(() => {
      navigate("/login")
    })

  }

  return (

    <div className="signup-page">

      <div className="signup-left">
        <div className="signup-logo">
          <Building2 size={28} />
          <h2>LeavePro</h2>
        </div>

        <div className="signup-content">
          <h1>Join Our Team</h1>
          <p>Create your employee account and start managing leaves efficiently.</p>

          <div className="signup-image">
            <img src={illustration} alt=""/>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-back" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </div>

        <div className="signup-card">
          <div className="signup-icon">
            <UserCircle size={40} />
          </div>

          <h2>Employee Signup</h2>

          <p>Create your account</p>

          <form className="signup-form" onSubmit={submit}>

            <div className="signup-grid">
              <div className="signup-group">
                <label>Full Name</label>
                <div className="signup-input">
                  <User size={18} />
                  <input type="text" name="name" placeholder="Full Name" value={employee.name} onChange={handleChange}/>
                </div>
                {errors.name &&
                  <p className="signup-error">{errors.name}</p>}
              </div>

              <div className="signup-group">
                <label>Email</label>
                <div className="signup-input">
                  <Mail size={18} />
                  <input type="email" name="email" placeholder="Email" value={employee.email} onChange={handleChange}/>
                </div>
                {errors.email &&
                  <p className="signup-error">{errors.email}</p>}
              </div>

              <div className="signup-group">
                <label>Department</label>
                <div className="signup-input">
                  <Briefcase size={18} />
                  <select name="department" value={employee.department} onChange={handleChange}>
                    <option value="">Select Department</option>
                    <option>Human Resources</option>
                    <option>Information Technology</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Operations</option>
                  </select>
                </div>
                {errors.department &&
                  <p className="signup-error">{errors.department}</p>}
              </div>

              <div className="signup-group">
                <label>Phone Number</label>
                <div className="signup-input">
                  <Phone size={18} />
                  <input type="text" name="phone" placeholder="Phone Number" value={employee.phone} onChange={handleChange}/>
                </div>
                {errors.phone &&
                  <p className="signup-error">{errors.phone}</p>}
              </div>

              <div className="signup-group">
                <label>Password</label>
                <div className="signup-input">
                  <Lock size={18} />
                  <input type="password" name="password" placeholder="Password" value={employee.password} onChange={handleChange}/>
                </div>
                {errors.password &&
                  <p className="signup-error">{errors.password}</p>}
              </div>

              <div className="signup-group">
                <label>Confirm Password</label>
                <div className="signup-input">
                  <Lock size={18} />
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" value={employee.confirmPassword} onChange={handleChange}/>
                </div>
                {errors.confirmPassword &&
                  <p className="signup-error">{errors.confirmPassword}</p>}
              </div>

            </div>

            <button className="signup-submit" type="submit">Create Account</button>

            <div className="signup-footer">
              <p>Already have an account?<span onClick={() => navigate("/login")}>Login</span></p>
            </div>

          </form>

        </div>

      </div>

    </div>

  )
}

export default Signup