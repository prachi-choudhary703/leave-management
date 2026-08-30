import React, { useEffect, useState } from "react"
import "./AdminDashboard.css"
import { Users, Clock3, CheckCircle2, XCircle, Bell, FileText, Wallet, Stethoscope } from "lucide-react"

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    activeAnnouncements: 0,
    unreadNotifications: 0,
    totalDeductions: 0,
    pendingMedical: 0
  })

  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    const employees = JSON.parse(localStorage.getItem("employees")) || []
    const leaves = JSON.parse(localStorage.getItem("leaveRequests")) || []
    const announcements = JSON.parse(localStorage.getItem("announcements")) || []
    const notifications = JSON.parse(localStorage.getItem("notifications")) || []
    const totalDeduction = employees.reduce((sum, emp) => sum + (Number(emp.salaryDeduction) || 0),0)

    setStats({
      totalEmployees: employees.length,
      pendingLeaves: leaves.filter(i => i.status === "Pending").length,
      approvedLeaves: leaves.filter(i => i.status === "Approved").length,
      rejectedLeaves: leaves.filter(i => i.status === "Rejected").length,
      activeAnnouncements: announcements.length,
      unreadNotifications: notifications.filter(i => i.role === "admin" && !i.read).length,
      totalDeductions: totalDeduction,
      pendingMedical: leaves.filter(i => i.leaveType === "Medical Leave" && i.status === "Pending").length
    })

    setRecentLeaves([...leaves].reverse().slice(0, 5))

  }, [])

  return (

    <div className="admin-dashboard">

      <div className="dashboard-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Welcome back! Here's an overview of your Leave Management System.</p>
        </div>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card blue">
          <div className="card-icon">
            <Users size={28} />
          </div>

          <div>
            <h3>{stats.totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>

        <div className="dashboard-card orange">
          <div className="card-icon">
            <Clock3 size={28} />
          </div>

          <div>
            <h3>{stats.pendingLeaves}</h3>
            <p>Pending Leaves</p>
          </div>
        </div>

        <div className="dashboard-card green">
          <div className="card-icon">
            <CheckCircle2 size={28} />
          </div>

          <div>
            <h3>{stats.approvedLeaves}</h3>
            <p>Approved Leaves</p>
          </div>
        </div>

        <div className="dashboard-card red">
          <div className="card-icon">
            <XCircle size={28} />
          </div>

          <div>
            <h3>{stats.rejectedLeaves}</h3>
            <p>Rejected Leaves</p>
          </div>
        </div>

        <div className="dashboard-card purple">
          <div className="card-icon">
            <Stethoscope size={28} />
          </div>

          <div>
            <h3>{stats.pendingMedical}</h3>
            <p>Medical Reviews</p>
          </div>
        </div>

        <div className="dashboard-card cyan">
          <div className="card-icon">
            <Bell size={28} />
          </div>

          <div>
            <h3>{stats.unreadNotifications}</h3>
            <p>Unread Notifications</p>
          </div>
        </div>

        <div className="dashboard-card yellow">
          <div className="card-icon">
            <FileText size={28} />
          </div>

          <div>
            <h3>{stats.activeAnnouncements}</h3>
            <p>Announcements</p>
          </div>
        </div>

        <div className="dashboard-card pink">
          <div className="card-icon">
            <Wallet size={28} />
          </div>

          <div>
            <h3>₹ {stats.totalDeductions}</h3>
            <p>Total Deductions</p>
          </div>
        </div>

      </div>

      <div className="recent-section">

        <div className="section-title">
          <h3>Recent Leave Requests</h3>
        </div>

        <div className="recent-table">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {
                recentLeaves.length > 0 ?
                  recentLeaves.map(item => (
                    <tr key={item.id}>
                      <td>{item.employeeName}</td>
                      <td>{item.leaveType}</td>
                      <td>{item.fromDate}</td>
                      <td>{item.toDate}</td>
                      <td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan="5">No Leave Requests Found</td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>

  )
}

export default AdminDashboard