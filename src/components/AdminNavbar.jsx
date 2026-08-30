import React, { useEffect, useState } from "react"
import "./AdminNavbar.css"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

import { Menu, Search, Bell, Calendar, ChevronDown, LogOut, UserCircle } from "lucide-react"

const AdminNavbar = ({ collapse, setCollapse }) => {

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
      item.role === "admin" &&
      !item.read
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
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("currentUser")
        navigate("/login")
      }
    })
  }

  return (

    <header className="admin-navbar">

      <div className="nav-left">
        <button className="menu-btn" onClick={() => setCollapse(!collapse)}>
          <Menu size={22} />
        </button>
        <h2>Dashboard</h2>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder="Search employees..." />
      </div>

      <div className="nav-right">

        <div className="today">
          <Calendar size={18} />
          <span>{today}</span>
        </div>

        <div className="bell" onClick={() => navigate("/admin/notifications")}>
          <Bell size={21} />
          <span>{count}</span>
        </div>

        <div className="profile" onClick={() => setOpen(!open)}>

          <UserCircle size={34} />

          <div>
            <h4>{currentUser.name || "Admin"}</h4>
            <p>Administrator</p>
          </div>

          <ChevronDown size={18} />

          {
            open &&
            <div className="dropdown">
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

export default AdminNavbar