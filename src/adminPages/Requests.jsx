import React, { useEffect, useState } from "react"
import "./Requests.css"
import Swal from "sweetalert2"
import { Search, Eye, CheckCircle, XCircle } from "lucide-react"

const Requests = () => {

  const [requests, setRequests] = useState([])

  const [search, setSearch] = useState("")

  const [statusFilter, setStatusFilter] = useState("All")

  const [leaveFilter, setLeaveFilter] = useState("All")

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("leaveRequests")) || []
    setRequests(data.reverse())
  }, [])

  function approveLeave(id) {
    Swal.fire({
      title: "Approve Leave?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve"
    }).then(result => {
      if (!result.isConfirmed) return;
      let leaveData = JSON.parse(localStorage.getItem("leaveRequests")) || []

      let employeeData = JSON.parse(localStorage.getItem("employees")) || []

      leaveData = leaveData.map(item => {
        if (item.id === id) {
          employeeData = employeeData.map(emp => {
            if (emp.employeeId === item.employeeId) {
              return {
                ...emp,
                remainingLeaves: emp.remainingLeaves - item.totalDays,
                usedLeaves: (emp.usedLeaves || 0) + item.totalDays
              }
            }
            return emp
          })

          const notifications = JSON.parse(localStorage.getItem("notifications")) || []

          notifications.push({
            id: Date.now(),
            role: "employee",
            employeeId: item.employeeId,
            title: "Leave Approved",
            message: `Your ${item.leaveType} request has been approved.`,
            date: new Date().toLocaleDateString(),
            read: false
          })

          localStorage.setItem("notifications", JSON.stringify(notifications))

          return {
            ...item,
            status: "Approved"
          }
        }
        return item
      })

      localStorage.setItem("leaveRequests", JSON.stringify(leaveData))

      localStorage.setItem("employees", JSON.stringify(employeeData))

      let currentUser = JSON.parse(localStorage.getItem("currentUser"))

      const updatedEmployee = employeeData.find(emp => emp.employeeId === currentUser.employeeId)
      if (updatedEmployee) {
        localStorage.setItem("currentUser", JSON.stringify(updatedEmployee))
      }

      setRequests(leaveData)

      Swal.fire({
        icon: "success",
        title: "Approved",
        text: "Leave approved successfully."
      })
    })
  }

  async function rejectLeave(id) {
    const result = await Swal.fire({
      title: "Reject Leave",
      input: "text",
      inputLabel: "Enter Remark",
      inputPlaceholder: "Reason...",
      showCancelButton: true,
      confirmButtonText: "Reject"
    })

    if (!result.isConfirmed) return

    let leaveData = JSON.parse(localStorage.getItem("leaveRequests")) || []

    leaveData = leaveData.map(item => {
      if (item.id === id) {
        const notifications = JSON.parse(localStorage.getItem("notifications")) || []

        notifications.push({
          id: Date.now(),
          role: "employee",
          employeeId: item.employeeId,
          title: "Leave Rejected",
          message: `Reason : ${result.value}`,
          date: new Date().toLocaleDateString(),
          read: false
        })

        localStorage.setItem("notifications", JSON.stringify(notifications))

        return {
          ...item,
          status: "Rejected",
          adminRemark: result.value
        };
      }
      return item
    })

    localStorage.setItem("leaveRequests", JSON.stringify(leaveData))

    setRequests(leaveData)

    Swal.fire({
      icon: "success",
      title: "Rejected"
    })
  }

  function viewRequest(item) {
    Swal.fire({
      title: item.employeeName,
      width: 650,
      html: `
            <p><b>Department :</b> ${item.department}</p>
            <p><b>Leave :</b> ${item.leaveType}</p>
            <p><b>From :</b> ${item.fromDate}</p>
            <p><b>To :</b> ${item.toDate}</p>
            <p><b>Total Days :</b> ${item.totalDays}</p>
            <p><b>Work Handover :</b> ${item.workHandover}</p>
            <p><b>Reason :</b> ${item.reason}</p>
            <p><b>Applied On :</b> ${item.appliedOn}</p>
            <p><b>Status :</b> ${item.status}</p>
            ${item.certificate ? `<p><b>Certificate :</b> ${item.certificate}</p>` : ""}
            `
    })
  }

  const filteredRequests = requests.filter(item => {
    const searchMatch = item.employeeName.toLowerCase().includes(search.toLowerCase())
    const statusMatch = statusFilter === "All" || item.status === statusFilter
    const leaveMatch = leaveFilter === "All" || item.leaveType === leaveFilter
    return searchMatch && statusMatch && leaveMatch
  })

  return (

    <div className="requests-page">

      <div className="requests-header">
        <div>
          <h2>Leave Requests</h2>
          <p>Manage employee leave requests</p>
        </div>
      </div>

      <div className="requests-top">
        <div className="request-search">
          <Search size={18} />
          <input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Cancelled</option>
        </select>

        <select value={leaveFilter} onChange={(e) => setLeaveFilter(e.target.value)}>
          <option>All</option>
          <option>Casual Leave</option>
          <option>Medical Leave</option>
          <option>Earned Leave</option>
          <option>Work From Home</option>
          <option>Emergency Leave</option>
        </select>
      </div>

      <div className="requests-table">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              filteredRequests.length > 0 ?
                filteredRequests.map(item => (
                  <tr key={item.id}>
                    <td>{item.employeeName}</td>
                    <td>{item.leaveType}</td>
                    <td>{item.fromDate}</td>
                    <td>{item.toDate}</td>
                    <td>{item.totalDays}</td>
                    <td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                    <td>
                      <div className="request-actions">
                        <button className="view-btn" onClick={() => viewRequest(item)}><Eye size={17} /></button>
                        {
                          item.status === "Pending" &&
                          <button className="approve-btn" onClick={() => approveLeave(item.id)}><CheckCircle size={17} /></button>
                        }
                        {
                          item.status === "Pending" &&
                          <button className="reject-btn" onClick={() => rejectLeave(item.id)}><XCircle size={17} /></button>
                        }
                      </div>
                    </td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="7">No Leave Requests Found</td>
                </tr>
            }
          </tbody>
        </table>
      </div>

    </div>

  )
}

export default Requests