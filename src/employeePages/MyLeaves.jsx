import React, { useEffect, useState } from "react"
import "./MyLeaves.css"
import Swal from "sweetalert2"
import { Search, Eye, Trash2 } from "lucide-react"

const MyLeaves = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {}

  const [leaves, setLeaves] = useState([])

  const [search, setSearch] = useState("")

  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("leaveRequests")) || []
    const myLeaves = data.filter(item => item.employeeId === currentUser.employeeId)
    setLeaves(myLeaves.reverse())
  }, [])

  function cancelLeave(id) {
    Swal.fire({
      title: "Cancel Leave?",
      text: "You can cancel only pending leave.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes"
    }).then(result => {
      if (result.isConfirmed) {
        let data =JSON.parse(localStorage.getItem("leaveRequests")) || []
        data = data.map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: "Cancelled"
            }
          }
          return item
        })

        localStorage.setItem("leaveRequests",JSON.stringify(data))

        const myLeaves = data.filter(item => item.employeeId === currentUser.employeeId)

        setLeaves(myLeaves)

        Swal.fire({
          icon: "success",
          title: "Cancelled",
          text: "Leave cancelled successfully."
        })
      }
    })
  }

  function viewRemark(text) {
    Swal.fire({
      title: "Admin Remark",
      text: text || "No Remark",
      icon: "info"
    })
  }

  const filteredLeaves = leaves.filter(item => {
    const searchMatch =item.leaveType.toLowerCase().includes(search.toLowerCase())
    const statusMatch =filter === "All"||item.status === filter
    return searchMatch && statusMatch
  })

  const total = leaves.length

  const pending =leaves.filter(item => item.status === "Pending").length

  const approved =leaves.filter(item => item.status === "Approved").length

  const rejected =leaves.filter(item => item.status === "Rejected").length

  return (

    <div className="myleave-page">

      <div className="myleave-header">
        <div>
          <h2>My Leaves</h2>
          <p>View all your leave requests</p>
        </div>
      </div>

      <div className="leave-stats">
        <div className="stat-box">
          <h4>Total</h4>
          <h2>{total}</h2>
        </div>

        <div className="stat-box">
          <h4>Pending</h4>
          <h2>{pending}</h2>
        </div>

        <div className="stat-box">
          <h4>Approved</h4>
          <h2>{approved}</h2>
        </div>

        <div className="stat-box">
          <h4>Rejected</h4>
          <h2>{rejected}</h2>
        </div>
      </div>

      <div className="table-top">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search Leave" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="table-container">

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Work Handover</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              filteredLeaves.length > 0 ?
                filteredLeaves.map(item => (
                  <tr key={item.id}>
                    <td>{item.leaveType}</td>
                    <td>{item.fromDate}</td>
                    <td>{item.toDate}</td>
                    <td>{item.totalDays}</td>
                    <td>{item.workHandover}</td>
                    <td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                    <td>{item.appliedOn}</td>
                    <td>
                      {
                        item.status === "Pending"?
                          <button className="cancel-btn" onClick={() => cancelLeave(item.id)}><Trash2 size={18} /></button>
                          :
                          <button className="view-btn" onClick={() => viewRemark(item.adminRemark)}><Eye size={18} /></button>
                      }
                    </td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="8">
                    No Leave Requests Found
                  </td>
                </tr>
            }
          </tbody>
          
        </table>

      </div>

    </div>

  )
}

export default MyLeaves