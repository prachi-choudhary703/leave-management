import React, { useEffect, useState } from "react"
import "./AdminNotification.css"
import Swal from "sweetalert2"
import { Search, Trash2, CheckCheck, Bell, Eye } from "lucide-react"

const AdminNotification = () => {

  const [notifications, setNotifications] = useState([])

  const [search, setSearch] = useState("")

  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("notifications")) || []
    const adminNotifications = data.filter(item => item.role === "admin")
    setNotifications([...adminNotifications].reverse())
  }, [])

  function loadNotifications() {

    const data = JSON.parse(localStorage.getItem("notifications")) || []
    const adminNotifications = data.filter(item => item.role === "admin")
    setNotifications([...adminNotifications].reverse())
  }

  function markAsRead(id) {

    let data = JSON.parse(localStorage.getItem("notifications")) || []

    data = data.map(item => {
      if (item.id === id) {
        return {
          ...item,
          read: true
        }
      }
      return item
    })

    localStorage.setItem("notifications", JSON.stringify(data))

    loadNotifications()
  }

  function markAllRead() {

    let data = JSON.parse(localStorage.getItem("notifications")) || []
    data = data.map(item => {
      if (item.role === "admin") {
        return {
          ...item,
          read: true
        }
      }
      return item
    })

    localStorage.setItem("notifications", JSON.stringify(data))

    loadNotifications()

    Swal.fire({
      icon: "success",
      title: "All Notifications Read"
    })
  }

  function deleteNotification(id) {

    Swal.fire({
      title: "Delete Notification?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    }).then(result => {
      if (result.isConfirmed) {
        let data = JSON.parse(localStorage.getItem("notifications")) || []
        data = data.filter(item => item.id !== id)
        localStorage.setItem("notifications", JSON.stringify(data))
        loadNotifications()

        Swal.fire({
          icon: "success",
          title: "Deleted"
        })
      }
    })
  }

  function clearAll() {

    Swal.fire({
      title: "Clear All Notifications?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    }).then(result => {

      if (result.isConfirmed) {
        let data = JSON.parse(localStorage.getItem("notifications")) || []
        data = data.filter(item => item.role !== "admin")
        localStorage.setItem("notifications", JSON.stringify(data))
        loadNotifications()

        Swal.fire({
          icon: "success",
          title: "All Notifications Cleared"
        })
      }
    })
  }

  function viewNotification(item) {

    Swal.fire({
      title: item.title,
      html: `
      <p><b>Message :</b> ${item.message}</p>
      <p><b>Date :</b> ${item.date}</p>
      <p><b>Status :</b> ${item.read ? "Read" : "Unread"}</p>
    `,
      icon: "info",
      confirmButtonText: "Close"
    })

  }

  const filteredNotifications = notifications.filter(item => {
    const searchMatch = item.title.toLowerCase().includes(search.toLowerCase()) || item.message.toLowerCase().includes(search.toLowerCase())
    const filterMatch = filter === "All" || (filter === "Read" && item.read) || (filter === "Unread" && !item.read)
    return searchMatch && filterMatch
  })

  return (

    <div className="admin-notification-page">

      <div className="notification-header">
        <div>
          <h2>Admin Notifications</h2>
          <p>Manage all system notifications</p>
        </div>

        <button className="mark-all-btn" onClick={markAllRead}>
          <CheckCheck size={18} />
          Mark All Read
        </button>
      </div>

      <div className="notification-top">

        <div className="notification-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Notifications"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Read</option>
          <option>Unread</option>
        </select>

        <button className="clear-btn" onClick={clearAll}>
          <Trash2 size={18} />
          Clear All
        </button>

      </div>

      <div className="notification-list">

        {
          filteredNotifications.length > 0 ?

            filteredNotifications.map(item => (

              <div
                key={item.id}
                className={`notification-card ${item.read ? "read" : "unread"}`}
              >

                <div className="notification-icon">
                  <Bell size={22} />
                </div>

                <div className="notification-content">
                  <h4>{item.title}</h4>
                  <span>{item.date}</span>
                </div>

                <div className="notification-actions">

                  <button className="view-btn" onClick={() => viewNotification(item)}><Eye size={17} /></button>
                  {
                    !item.read &&
                    <button className="read-btn" onClick={() => markAsRead(item.id)}><CheckCheck size={17} /></button>
                  }
                  <button className="delete-btn" onClick={() => deleteNotification(item.id)}><Trash2 size={17} /></button>
                </div>
              </div>

            ))

            :

            <div className="empty-state">
              <Bell size={45} />
              <h3>No Notifications Found</h3>
              <p>You're all caught up.</p>
            </div>
        }

      </div>

    </div>

  )
}

export default AdminNotification