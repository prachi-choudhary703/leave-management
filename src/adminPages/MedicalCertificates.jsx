import React, { useEffect, useState } from "react"
import "./MedicalCertificates.css"
import Swal from "sweetalert2"
import { Search, Eye, CheckCircle, XCircle, FileText } from "lucide-react"

const MedicalCertificates = () => {

  const [requests, setRequests] = useState([])

  const [search, setSearch] = useState("")

  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    const leaveData = JSON.parse(localStorage.getItem("leaveRequests")) || []
    const medicalLeaves = leaveData.filter(item => item.leaveType === "Medical Leave")
    setRequests(medicalLeaves)
  }, [])

  function approveCertificate(id) {
    Swal.fire({
      title: "Approve Medical Leave?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve"
    }).then(result => {
      if (!result.isConfirmed) return

      let leaveData = JSON.parse(localStorage.getItem("leaveRequests")) || []

      let employees = JSON.parse(localStorage.getItem("employees")) || []

      leaveData = leaveData.map(item => {
        if (item.id === id) {
          employees = employees.map(emp => {
            if (emp.employeeId === item.employeeId) {
              return {
                ...emp,
                remainingLeaves: emp.remainingLeaves - item.totalDays,
                usedLeaves: (emp.usedLeaves || 0) + item.totalDays
              }
            }
            return emp
          })

          let notifications = JSON.parse(localStorage.getItem("notifications")) || []

          notifications.push({
            id: Date.now(),
            role: "employee",
            employeeId: item.employeeId,
            title: "Medical Leave Approved",
            message: "Your medical leave has been approved.",
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
      localStorage.setItem("employees", JSON.stringify(employees))

      setRequests(leaveData.filter(item => item.leaveType === "Medical Leave"))

      Swal.fire({
        icon: "success",
        title: "Approved"
      })
    })
  }

  async function rejectCertificate(id) {
    const result = await Swal.fire({
      title: "Reject Medical Leave",
      input: "text",
      inputLabel: "Remark",
      showCancelButton: true,
      confirmButtonText: "Reject"
    })

    if (!result.isConfirmed) return

    let leaveData = JSON.parse(localStorage.getItem("leaveRequests")) || []

    leaveData = leaveData.map(item => {
      if (item.id === id) {
        let notifications = JSON.parse(localStorage.getItem("notifications")) || []

        notifications.push({
          id: Date.now(),
          role: "employee",
          employeeId: item.employeeId,
          title: "Medical Leave Rejected",
          message: result.value,
          date: new Date().toLocaleDateString(),
          read: false
        })

        localStorage.setItem("notifications", JSON.stringify(notifications))

        return {
          ...item,
          status: "Rejected",
          adminRemark: result.value
        }
      }
      return item
    })

    localStorage.setItem("leaveRequests", JSON.stringify(leaveData))

    setRequests(leaveData.filter(item => item.leaveType === "Medical Leave"))

    Swal.fire({
      icon: "success",
      title: "Rejected"
    })
  }

  function viewDetails(item) {

    Swal.fire({
      title: item.employeeName,
      width: 650,
      html: `
            <p><b>Department :</b> ${item.department}</p>
            <p><b>From :</b> ${item.fromDate}</p>
            <p><b>To :</b> ${item.toDate}</p>
            <p><b>Total Days :</b> ${item.totalDays}</p>
            <p><b>Reason :</b> ${item.reason}</p>
            <p><b>Status :</b> ${item.status}</p>
            <p><b>Applied On :</b> ${item.appliedOn}</p>
            `
    })
  }

  function viewCertificate(item) {

    if (item.certificate) {
      window.open(item.certificate, "_blank")
    }
    else {
      Swal.fire({
        icon: "info",
        title: "No Certificate Uploaded"
      })
    }
  }

  const filteredRequests = requests.filter(item => {
    const searchMatch = item.employeeName.toLowerCase().includes(search.toLowerCase())
    const statusMatch = statusFilter === "All" || item.status === statusFilter
    return searchMatch && statusMatch
  })

  return (

    <div className="medical-page">

      <div className="medical-header">
        <div>
          <h2>Medical Certificates</h2>
          <p>Review employee medical leave requests</p>
        </div>
      </div>

      <div className="medical-top">
        <div className="medical-search"><Search size={18} />
          <input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="medical-table">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Status</th>
              <th>Certificate</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              filteredRequests.length > 0 ?
                filteredRequests.map(item => (
                  <tr key={item.id}>
                    <td>{item.employeeName}</td>
                    <td>{item.department}</td>
                    <td>{item.fromDate}</td>
                    <td>{item.toDate}</td>
                    <td>{item.totalDays}</td>
                    <td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                    <td><button className="certificate-btn" onClick={() => viewCertificate(item)}><FileText size={17} /></button></td>
                    <td>
                      <div className="medical-actions">
                        <button className="view-btn" onClick={() => viewDetails(item)}><Eye size={17} /></button>
                        {
                          item.status === "Pending" &&
                          <>
                            <button className="approve-btn" onClick={() => approveCertificate(item.id)}><CheckCircle size={17} /></button>
                            <button className="reject-btn" onClick={() => rejectCertificate(item.id)}><XCircle size={17} /></button>
                          </>
                        }
                      </div>
                    </td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="8">No Medical Leave Requests Found</td>
                </tr>
            }
          </tbody>
        </table>
      </div>

    </div>

  )
}

export default MedicalCertificates