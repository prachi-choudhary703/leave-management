import React, { useEffect, useState } from "react"
import "./Apply.css"
import Swal from "sweetalert2"

const Apply = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {}

  const [leave, setLeave] = useState({ 
    leaveType: "", 
    fromDate: "", 
    toDate: "", 
    totalDays: 0, 
    workHandover: "", 
    reason: "", 
    certificate: "" })

  const [errors, setErrors] = useState({})

  const employees = [
    "Rahul Sharma",
    "Neha Gupta",
    "Amit Kumar",
    "Priya Verma"
  ]

  function handleChange(e) {
    const { name, value } = e.target
    setLeave({
      ...leave,
      [name]: value
    })
  }

  function handleCertificate(e) {
    const file = e.target.files[0]
    if (file) {
      setLeave({
        ...leave,
        certificate: file.name
      })
    }
  }

  useEffect(() => {
    if (leave.fromDate && leave.toDate) {
      const start = new Date(leave.fromDate)
      const end = new Date(leave.toDate)
      const diff = end - start
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
      if (days > 0) {
        setLeave(prev => ({
          ...prev,
          totalDays: days
        }))
      }
    }
  }, [leave.fromDate, leave.toDate])

  function validate() {

    let newErrors = {}

    if (leave.leaveType === "") {
      newErrors.leaveType = "Leave Type is required"
    }

    if (leave.fromDate === "") {
      newErrors.fromDate = "From Date is required"
    }

    if (leave.toDate === "") {
      newErrors.toDate = "To Date is required"
    }

    if (leave.workHandover === "") {
      newErrors.workHandover = "Select Work Handover"
    }

    if (leave.reason === "") {
      newErrors.reason = "Reason is required"
    }

    if (leave.reason.length < 10) {
      newErrors.reason = "Minimum 10 characters required"
    }

    const today = new Date().toISOString().split("T")[0]

    if (leave.fromDate < today) {
      newErrors.fromDate = "Past dates are not allowed"
    }

    if (leave.toDate < leave.fromDate) {
      newErrors.toDate = "Invalid date range";
    }

    if (leave.totalDays > currentUser.remainingLeaves) {
      newErrors.totalDays = "Insufficient Leave Balance"
    }

    if (leave.leaveType === "Medical Leave" && leave.certificate === "") {
      newErrors.certificate = "Medical Certificate Required"
    }

    const oldLeaves = JSON.parse(localStorage.getItem("leaveRequests")) || []

    const conflict = oldLeaves.find(item => {
      return (
        item.employeeId === currentUser.employeeId &&
        leave.fromDate <= item.toDate &&
        leave.toDate >= item.fromDate
      )
    })

    if (conflict) {
      newErrors.conflict = "Leave Conflict Detected"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  function submit(e) {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const oldLeaves = JSON.parse(localStorage.getItem("leaveRequests")) || []

    const request = {
      id: Date.now(),
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: currentUser.department,
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      totalDays: leave.totalDays,
      workHandover: leave.workHandover,
      reason: leave.reason,
      certificate: leave.certificate,
      status: "Pending",
      adminRemark: "",
      appliedOn: new Date().toLocaleDateString()
    }

    oldLeaves.push(request)

    localStorage.setItem("leaveRequests", JSON.stringify(oldLeaves))

    let notifications = JSON.parse(localStorage.getItem("notifications")) || []

    notifications.push({
      id: Date.now(),
      role: "admin",
      title: "New Leave Request",
      message: `${currentUser.name} applied for ${leave.leaveType}.`,
      date: new Date().toLocaleDateString(),
      read: false
    })

    localStorage.setItem("notifications", JSON.stringify(notifications))

    Swal.fire({
      icon: "success",
      title: "Leave Applied",
      text: "Your leave request has been submitted."
    })

    setLeave({
      leaveType: "",
      fromDate: "",
      toDate: "",
      totalDays: 0,
      workHandover: "",
      reason: "",
      certificate: ""
    })

  }

  return (

    <div className="apply-page">

      <div className="apply-header">
        <h2>Apply Leave</h2>
        <p>Submit your leave request.</p>
      </div>

      <form className="apply-form" onSubmit={submit}>

        <div className="apply-grid">

          <div className="apply-group">
            <label>Leave Type</label>
            <select name="leaveType" value={leave.leaveType} onChange={handleChange}>
              <option value="">Select Leave Type</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Work From Home">Work From Home</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>
            {errors.leaveType &&
              <p className="apply-error">{errors.leaveType}</p>
            }
          </div>

          <div className="apply-group">
            <label>From Date</label>
            <input type="date" name="fromDate" value={leave.fromDate} onChange={handleChange} />
            {errors.fromDate &&
              <p className="apply-error">{errors.fromDate}</p>
            }
          </div>

          <div className="apply-group">
            <label>To Date</label>
            <input type="date" name="toDate" value={leave.toDate} onChange={handleChange} />
            {errors.toDate &&
              <p className="apply-error">{errors.toDate}</p>
            }
          </div>

          <div className="apply-group">
            <label>Total Days</label>
            <input type="number" value={leave.totalDays} readOnly />
            {errors.totalDays &&
              <p className="apply-error">{errors.totalDays}</p>
            }
          </div>

          <div className="apply-group">
            <label>Work Handover To</label>
            <select name="workHandover" value={leave.workHandover} onChange={handleChange}>
              <option value="">Select Employee</option>
              {
                employees.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
            {errors.workHandover &&
              <p className="apply-error">{errors.workHandover}</p>
            }
          </div>

        </div>

        <div className="apply-group full-width">
          <label>Reason</label>
          <textarea rows="5" name="reason" placeholder="Enter Reason" value={leave.reason} onChange={handleChange}></textarea>
          {errors.reason &&
            <p className="apply-error">{errors.reason}</p>
          }
        </div>

        {
          leave.leaveType === "Medical Leave" &&
          <div className="apply-group full-width">
            <label>Medical Certificate</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleCertificate} />
            {
              leave.certificate &&
              <small>Selected :{" "}{leave.certificate}</small>
            }
            {
              errors.certificate &&
              <p className="apply-error">{errors.certificate}</p>
            }
          </div>
        }

        {
          errors.conflict &&
          <p className="apply-error">{errors.conflict}</p>
        }

        <div className="summary-card">
          <h3>Leave Summary</h3>

          <div className="summary-row">
            <span>Remaining Leaves</span>
            <strong>{currentUser.remainingLeaves || 0}</strong>
          </div>

          <div className="summary-row">
            <span>Requested Days</span>
            <strong>{leave.totalDays}</strong>
          </div>

          <div className="summary-row">
            <span>Balance After Approval</span>
            <strong>{(currentUser.remainingLeaves || 0) - leave.totalDays}</strong>
          </div>

        </div>

        <button className="apply-btn" type="submit">Apply Leave</button>

      </form>

    </div>

  )
}

export default Apply