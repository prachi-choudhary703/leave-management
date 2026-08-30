import React from "react"
import "./EmpDashboard.css"

import { CalendarDays, Clock3, CheckCircle, IndianRupee, Megaphone, CalendarClock } from "lucide-react"

const EmpDashboard = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {}

  const leaveRequests = JSON.parse(localStorage.getItem("leaveRequests")) || []

  const announcements = JSON.parse(localStorage.getItem("announcements")) || []

  const holidays = JSON.parse(localStorage.getItem("holidays")) || [
    {
      title: "Independence Day",
      date: "15 Aug 2026"
    },
    {
      title: "Gandhi Jayanti",
      date: "2 Oct 2026"
    },
    {
      title: "Diwali",
      date: "8 Nov 2026"
    }
  ]

  const myRequests = leaveRequests.filter(item => item.employeeId === currentUser.employeeId)

  const pendingLeaves = myRequests.filter(item => item.status === "Pending").length

  const approvedLeaves = myRequests.filter(item => item.status === "Approved").length

  const salary = currentUser.salary || 0

  const deduction = currentUser.salaryDeduction || 0

  const netSalary = salary - deduction

  const hour = new Date().getHours()

  let greeting = "Good Evening 🌙"
  if (hour < 12) {
    greeting = "Good Morning ☀️"
  }
  else if (hour < 17) {
    greeting = "Good Afternoon 🌤️"
  }

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (

    <div className="emp-dashboard">

      <div className="emp-banner">
        <div>
          <h2>{greeting},{" "}{currentUser.name || "Employee"} 👋 </h2>
          <p>Hope you have a productive day.</p>
        </div>

        <div className="emp-info">
          <p><strong>ID :</strong>{" "}{currentUser.employeeId}</p>
          <p><strong>Department :</strong>{" "}{currentUser.department}</p>
          <span>{today}</span>
        </div>
      </div>

      <div className="emp-cards">

        <div className="emp-card">
          <CalendarDays size={30} />
          <h3>Remaining Leaves</h3>
          <h1>{currentUser.remainingLeaves || 0}</h1>
        </div>

        <div className="emp-card">
          <Clock3 size={30} />
          <h3>Pending Requests</h3>
          <h1>{pendingLeaves}</h1>
        </div>

        <div className="emp-card">
          <CheckCircle size={30} />
          <h3>Approved Leaves</h3>
          <h1>{approvedLeaves}</h1>
        </div>

        <div className="emp-card">
          <IndianRupee size={30} />
          <h3>Salary</h3>
          <h1>₹{salary}</h1>
        </div>

      </div>

      <div className="emp-middle">

        <div className="emp-box">
          <h3>Leave Progress</h3>
          <div className="progress-item">
            <p>Used Leaves</p>
            <progress value={currentUser.usedLeaves || 0} max="12"></progress>
            <span>{currentUser.usedLeaves || 0}/12</span>
          </div>

          <div className="progress-item">
            <p>Remaining Leaves</p>
            <progress value={currentUser.remainingLeaves || 0} max="12"></progress>
            <span>{currentUser.remainingLeaves || 0}/12</span>
          </div>

        </div>

        <div className="emp-box">
          <h3>Salary Summary</h3>
          <div className="salary-row">
            <span>Current Salary</span>
            <strong>₹{salary}</strong>
          </div>

          <div className="salary-row">
            <span>Deduction</span>
            <strong>₹{deduction}</strong>
          </div>

          <div className="salary-row total">
            <span>Net Salary</span>
            <strong>₹{netSalary}</strong>
          </div>
        </div>

      </div>

      <div className="emp-bottom">

        <div className="emp-box">
          <h3><Megaphone size={18} />Latest Announcement</h3>
          {
            announcements.length > 0?
              <>
                <h4>{announcements[announcements.length - 1].title}</h4>
                <p>{announcements[announcements.length - 1].description}</p>
              </>
              :
              <p>No announcements available.</p>
          }
        </div>

        <div className="emp-box">
          <h3><CalendarClock size={18} />Upcoming Holidays</h3>
          {
            holidays.map((item, index) => (
              <div key={index} className="holiday-item">
                <span>{item.title}</span>
                <strong>{item.date}</strong>
              </div>
            ))
          }
        </div>

      </div>

    </div>

  )
}

export default EmpDashboard