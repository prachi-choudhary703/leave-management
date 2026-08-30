import React from "react"
import { Routes, Route } from "react-router-dom"
import "./App.css"

// Landing
import Landing from "./landing/Landing"

// Authentication
import Login from "./auth/Login"
import Signup from "./auth/Signup"

// Admin Pages
import AdminDashboard from "./adminPages/AdminDashboard"
import Employees from "./adminPages/Employees"
import Requests from "./adminPages/Requests"
import Announcements from "./adminPages/Announcements"
import SalaryDeduction from "./adminPages/SalaryDeduction"
import MedicalCertificates from "./adminPages/MedicalCertificates"
import AdminNotification from "./adminPages/AdminNotification"

// Employee Pages
import EmpDashboard from "./employeePages/EmpDashboard"
import Apply from "./employeePages/Apply"
import MyLeaves from "./employeePages/MyLeaves"
import Salary from "./employeePages/Salary"
import Profile from "./employeePages/Profile"
import EmpNotification from "./employeePages/EmpNotification"

// Layouts
import AdminLayout from "./layouts/AdminLayout"
import EmployeeLayout from "./layouts/EmployeeLayout"

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="requests" element={<Requests />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="salary" element={<SalaryDeduction />} />
        <Route path="certificates" element={<MedicalCertificates />} />
        <Route path="notifications" element={<AdminNotification />} />
      </Route>

      <Route path="/employee" element={<EmployeeLayout />}>
        <Route path="dashboard" element={<EmpDashboard />} />
        <Route path="apply" element={<Apply />} />
        <Route path="myleaves" element={<MyLeaves />} />
        <Route path="salary" element={<Salary />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<EmpNotification />} />
      </Route>
      
    </Routes>
  )
}

export default App