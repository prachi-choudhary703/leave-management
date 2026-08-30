import React, { useEffect, useState } from "react"
import "./SalaryDeduction.css"
import Swal from "sweetalert2"
import { Search, IndianRupee, Pencil } from "lucide-react"

const SalaryDeduction = () => {

  const [employees, setEmployees] = useState([])

  const [search, setSearch] = useState("")

  const [department, setDepartment] = useState("All")

  const [showModal, setShowModal] = useState(false)

  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [errors, setErrors] = useState({})

  const [salaryData, setSalaryData] = useState({
    deduction: "",
    reason: "",
    month: "",
    status: "Paid"
  })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("employees")) || []
    setEmployees(data)
  }, [])

  function handleChange(e) {
    const { name, value } = e.target;
    setSalaryData({
      ...salaryData,
      [name]: value
    })
  }

  function openModal(emp) {
    setSelectedEmployee(emp)
    setSalaryData({
      deduction: emp.salaryDeduction || "",
      reason: emp.deductionReason || "",
      month: "",
      status: "Paid"
    })
    setErrors({})
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
  }

  function validate() {

    let newErrors = {};

    if (salaryData.deduction === "") {
      newErrors.deduction = "Deduction Required"
    }

    else if (Number(salaryData.deduction) > Number(selectedEmployee.salary)) {
      newErrors.deduction = "Deduction cannot exceed salary"
    }

    if (salaryData.reason === "") {
      newErrors.reason = "Reason Required"
    }

    if (salaryData.month === "") {
      newErrors.month = "Select Month";
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function saveDeduction(e) {

    e.preventDefault()

    if (!validate()) {
      return
    }

    let employeeData = JSON.parse(localStorage.getItem("employees")) || []

    employeeData = employeeData.map(emp => {
      if (emp.employeeId === selectedEmployee.employeeId) {
        return {
          ...emp,
          salaryDeduction: Number(salaryData.deduction),
          deductionReason: salaryData.reason
        }
      }
      return emp
    })

    localStorage.setItem("employees", JSON.stringify(employeeData))

    let currentUser = JSON.parse(localStorage.getItem("currentUser"))

    if (
      currentUser &&
      currentUser.employeeId === selectedEmployee.employeeId
    ) {
      currentUser.salaryDeduction = Number(salaryData.deduction)
      currentUser.deductionReason = salaryData.reason

      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    let history = JSON.parse(localStorage.getItem("salaryHistory")) || []

    const existingRecord = history.find(item => item.employeeId === selectedEmployee.employeeId && item.month === salaryData.month)

    const action = existingRecord ? "Updated" : "Created"

    history.push({
      id: Date.now(),
      employeeId: selectedEmployee.employeeId,
      employeeName: selectedEmployee.name,
      month: salaryData.month,
      salary: selectedEmployee.salary,
      deduction: Number(salaryData.deduction),
      netSalary: selectedEmployee.salary - Number(salaryData.deduction),
      reason: salaryData.reason,
      status: salaryData.status,
      action: action,
      updatedAt: new Date().toLocaleString()
    })

    localStorage.setItem("salaryHistory", JSON.stringify(history))

    let notifications = JSON.parse(localStorage.getItem("notifications")) || []

    notifications.push({
      id: Date.now(),
      role: "employee",
      employeeId: selectedEmployee.employeeId,
      title: "Salary Updated",
      message: `Salary deduction updated for ${salaryData.month}.`,
      date: new Date().toLocaleDateString(),
      read: false
    })

    localStorage.setItem("notifications", JSON.stringify(notifications))

    setEmployees(employeeData)
    setShowModal(false)

    Swal.fire({
      icon: "success",
      title: "Salary Updated",
      text: "Deduction saved successfully."
    })
  }

  const filteredEmployees = employees.filter(emp => {
    const searchMatch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.employeeId.toLowerCase().includes(search.toLowerCase())
    const deptMatch = department === "All" || emp.department === department
    return searchMatch && deptMatch
  })

  return (

    <div className="salary-deduction-page">

      <div className="salary-header">
        <div>
          <h2>Salary Deduction</h2>
          <p>Manage employee salary deductions</p>
        </div>
      </div>

      <div className="salary-top">
        <div className="salary-search">
          <Search size={18} />
          <input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option>All</option>
          <option>Information Technology</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Marketing</option>
        </select>
      </div>

      <div className="salary-table">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Deduction</th>
              <th>Net Salary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              filteredEmployees.length > 0 ?
                filteredEmployees.map(emp => (
                  <tr key={emp.employeeId}>
                    <td><img className="emp-img" src={emp.photo || `https://ui-avatars.com/api/?name=${emp.name}`} alt="" /></td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>₹{emp.salary}</td>
                    <td>₹{emp.salaryDeduction || 0}</td>
                    <td>₹{emp.salary - (emp.salaryDeduction || 0)}</td>
                    <td><button className="salary-btn" onClick={() => openModal(emp)}><Pencil size={17} /></button></td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="8">No Employees Found</td>
                </tr>
            }
          </tbody>
        </table>
      </div>

      {
        showModal &&
        <div className="modal-overlay">

          <div className="salary-modal">
            <h3>Update Salary Deduction</h3>
            <form onSubmit={saveDeduction}>

              <div className="modal-grid">
                <div>
                  <label>Employee</label>
                  <input type="text" value={selectedEmployee.name} readOnly />
                </div>

                <div>
                  <label>Current Salary</label>
                  <input type="text" value={`₹${selectedEmployee.salary}`} readOnly />
                </div>

                <div>
                  <label>Deduction</label>
                  <input type="number" name="deduction" value={salaryData.deduction} onChange={handleChange} />
                  <small>{errors.deduction}</small>
                </div>

                <div>
                  <label>Month</label>
                  <input type="month" name="month" value={salaryData.month} onChange={handleChange} />
                  <small>{errors.month}</small>
                </div>

                <div className="full">
                  <label>Reason</label>
                  <textarea rows="4" name="reason" value={salaryData.reason} onChange={handleChange}></textarea>
                  <small>{errors.reason}</small>
                </div>

                <div>
                  <label>Status</label>
                  <select name="status" value={salaryData.status} onChange={handleChange}>
                    <option>Paid</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>

              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="save-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>

  )
}

export default SalaryDeduction