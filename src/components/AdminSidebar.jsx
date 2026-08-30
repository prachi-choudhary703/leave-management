import React from "react"
import "./AdminSidebar.css"
import { NavLink, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import {Building2,LayoutDashboard,Users,FileText,Megaphone,BadgeDollarSign,FileBadge,Bell,LogOut,UserCircle} from "lucide-react"

const AdminSidebar = ({ collapse }) => {

  const navigate = useNavigate()

  const currentUser =JSON.parse(localStorage.getItem("currentUser")) || {}

  function logout() {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
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

    <aside className={collapse ? "admin-sidebar collapse" : "admin-sidebar"}>

      <div className="admin-logo">
        <Building2 size={28} />
        {!collapse && <h2>LeavePro</h2>}
      </div>

      <div className="admin-profile">
        <UserCircle size={48} />

        {!collapse && (
          <>
            <h3>{currentUser.name || "Admin"}</h3>
            <span>Administrator</span>
          </>
        )}

      </div>

      <nav className="admin-menu">

        <NavLink to="/admin/dashboard">
          <LayoutDashboard size={20} />
          {!collapse && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/employees">
          <Users size={20} />
          {!collapse && <span>Employees</span>}
        </NavLink>

        <NavLink to="/admin/requests">
          <FileText size={20} />
          {!collapse && <span>Leave Requests</span>}
        </NavLink>

        <NavLink to="/admin/announcements">
          <Megaphone size={20} />
          {!collapse && <span>Announcements</span>}
        </NavLink>

        <NavLink to="/admin/salary">
          <BadgeDollarSign size={20} />
          {!collapse && <span>Salary Deduction</span>}
        </NavLink>

        <NavLink to="/admin/certificates">
          <FileBadge size={20} />
          {!collapse && <span>Medical Certificates</span>}
        </NavLink>

        <NavLink to="/admin/notifications">
          <Bell size={20} />
          {!collapse && <span>Notifications</span>}
        </NavLink>

      </nav>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={20} />
        {!collapse && <span>Logout</span>}
      </button>

    </aside>

  )
}

export default AdminSidebar