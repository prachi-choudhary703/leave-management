import React from "react"
import "./EmployeeSidebar.css"
import { NavLink, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import {Building2,LayoutDashboard,CalendarPlus,FileText,BadgeDollarSign,Bell,User,LogOut,UserCircle} from "lucide-react"

const EmployeeSidebar = ({ collapse }) => {

  const navigate = useNavigate()

  const currentUser =JSON.parse(localStorage.getItem("currentUser")) || {}

  function logout() {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("currentUser")
        navigate("/login")
      }
    })

  }

  return (

    <aside className={collapse ? "employee-sidebar collapse" : "employee-sidebar"}>

      <div className="employee-logo">
        <Building2 size={28} />
        {!collapse && <h2>LeavePro</h2>}
      </div>

      <div className="employee-profile">
        <UserCircle size={50} />
        {!collapse && (
          <>
            <h3>{currentUser.name || "Employee"}</h3>
            <span>Employee</span>
          </>
        )}
      </div>

      <nav className="employee-menu">

        <NavLink to="/employee/dashboard">
          <LayoutDashboard size={20} />
          {!collapse && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/employee/apply">
          <CalendarPlus size={20} />
          {!collapse && <span>Apply Leave</span>}
        </NavLink>

        <NavLink to="/employee/myleaves">
          <FileText size={20} />
          {!collapse && <span>My Leaves</span>}
        </NavLink>

        <NavLink to="/employee/salary">
          <BadgeDollarSign size={20} />
          {!collapse && <span>Salary</span>}
        </NavLink>

        <NavLink to="/employee/notifications">
          <Bell size={20} />
          {!collapse && <span>Notifications</span>}
        </NavLink>

        <NavLink to="/employee/profile">
          <User size={20} />
          {!collapse && <span>Profile</span>}
        </NavLink>

      </nav>

      {!collapse && (
        <div className="leave-card">
          <h4>Remaining Leaves</h4>
          <span>{currentUser.remainingLeaves || 0} Days</span>
          <small>Available this year</small>
        </div>
      )}

      <button className="employee-logout" onClick={logout}>
        <LogOut size={20} />
        {!collapse && <span>Logout</span>}
      </button>

    </aside>

  )
}

export default EmployeeSidebar