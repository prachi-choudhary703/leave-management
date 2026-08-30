import React, { useEffect, useState } from "react"
import "./EmployeeNavbar.css"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import { Menu, Search, Bell, Calendar, ChevronDown, LogOut, UserCircle } from "lucide-react"

const EmployeeNavbar = ({ collapse, setCollapse }) => {

  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {}

  const [open, setOpen] = useState(false)

  const [count, setCount] = useState(0)

  useEffect(() => {
    loadNotifications()

    const interval = setInterval(() => {
      loadNotifications()
    }, 500)

    return () => clearInterval(interval)
  }, [])

  function loadNotifications() {

    const notifications = JSON.parse(localStorage.getItem("notifications")) || []

    const unread = notifications.filter(item =>
      item.role === "employee" &&
      !item.read &&
      (
        item.employeeId === currentUser.employeeId ||
        item.employeeId === "ALL"
      )
    )

    setCount(unread.length)
  }

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  function logout() {
    Swal.fire({
      title: "Logout?",
      text: "Do you really want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("currentUser")
        navigate("/login")
      }
    })
  }

  return (

    <header className="employee-navbar">

      <div className="employee-nav-left">
        <button className="employee-menu-btn" onClick={() => setCollapse(!collapse)}>
          <Menu size={22} />
        </button>
        <h2>Dashboard</h2>
      </div>

      <div className="employee-search-box">
        <Search size={18} />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="employee-nav-right">

        <div className="employee-today">
          <Calendar size={18} />
          <span>{today}</span>
        </div>

        <div className="employee-bell" onClick={() => navigate("/employee/notifications")}>
          <Bell size={21} />
          <span>{count}</span>
        </div>

        <div className="employee-profile-box" onClick={() => setOpen(!open)}>

          <UserCircle size={34} />

          <div>
            <h4>{currentUser.name || "Employee"}</h4>
            <p>Employee</p>
          </div>

          <ChevronDown size={18} />

          {
            open &&
            <div className="employee-dropdown">
              <button onClick={logout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          }

        </div>

      </div>

    </header>

  )
}

export default EmployeeNavbar