import React, { useEffect, useState } from "react"
import "./EmpNotification.css"
import Swal from "sweetalert2"
import { Bell, Search, Trash2, CheckCircle, Eye } from "lucide-react"

const EmpNotification = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {}

  const [notifications, setNotifications] = useState([])

  const [search, setSearch] = useState("")

  const [filter, setFilter] = useState("All")

  useEffect(() => {
    loadNotifications()
  }, [])

  function loadNotifications() {
    let data = JSON.parse(localStorage.getItem("notifications")) || []

    data = data.filter(item => item.role === "employee" && (item.employeeId === currentUser.employeeId || item.employeeId === "ALL")).reverse()
    setNotifications(data)
  }

  function markRead(id) {

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
      if (item.role === "employee" && (item.employeeId === currentUser.employeeId || item.employeeId === "ALL")
      ) {
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
      title: "Done",
      text: "All notifications marked as read."
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

  const filtered = notifications.filter(item => {
    const searchMatch = item.message.toLowerCase().includes(search.toLowerCase())
    const filterMatch = filter === "All" || (filter === "Read" && item.read) || (filter === "Unread" && !item.read)
    return searchMatch && filterMatch
  })

  return (

    <div className="notification-page">

      <div className="notification-header">
        <div>
          <h2>Notifications</h2>
          <p>View all notifications</p>
        </div>
        <button className="read-btn" onClick={markAllRead}>Mark All Read</button>
      </div>

      <div className="notification-top">
        <div className="notification-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Notification"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Read</option>
          <option>Unread</option>
        </select>
      </div>

      <div className="notification-list">
        {
          filtered.length > 0 ?
            filtered.map(item => (
              <div className={`notification-card ${item.read ? "" : "unread"}`} key={item.id}>

                <div className="notification-left">
                  <Bell />

                  <div>
                    <h4>{item.title}</h4>
                    <small>{item.date}</small>
                  </div>
                </div>

                <div className="notification-actions">
                  <button className="icon-btn blue" onClick={() => viewNotification(item)}><Eye size={18} /></button>
                  {
                    !item.read &&
                    <button className="icon-btn green" onClick={() => markRead(item.id)}><CheckCircle size={18} /></button>
                  }
                  <button className="icon-btn red" onClick={() => deleteNotification(item.id)}><Trash2 size={18} /></button>
                </div>

              </div>
            ))
            :
            <div className="empty-box">
              No Notifications Found
            </div>
        }
      </div>

    </div>

  )
}

export default EmpNotification