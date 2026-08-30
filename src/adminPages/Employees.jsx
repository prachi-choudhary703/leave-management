import React, { useEffect, useState } from "react"
import "./Employees.css"
import Swal from "sweetalert2"
import {Search,Eye,Pencil,Trash2,UserPlus,X} from "lucide-react"

const Employees = () => {

  const [employees, setEmployees] = useState([])

  const [search, setSearch] = useState("")

  const [department, setDepartment] = useState("All")

  const [status, setStatus] = useState("All")

  const [showModal, setShowModal] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  const [currentId, setCurrentId] = useState(null)

  const [errors, setErrors] = useState({})

  const [employee, setEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
    joiningDate: "",
    password: "",
    remainingLeaves: 12,
    usedLeaves: 0,
    status: "Active",
    photo: ""
  })

  useEffect(() => {
    const data =JSON.parse(localStorage.getItem("employees")) || []
    setEmployees(data)
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setEmployee({
      ...employee,
      [name]: value
    })
  }

  function uploadPhoto(e) {

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      setEmployee(prev => ({
        ...prev,
        photo: reader.result
      }))
    }
    reader.readAsDataURL(file)
  }

  function validate() {

    let newErrors = {}

    if (employee.name === "") {
      newErrors.name = "Name is required";
    }

    if (employee.email === "") {
      newErrors.email = "Email is required"
    }

    if (employee.phone === "") {
      newErrors.phone = "Phone Number is required"
    }

    else if (employee.phone.length !== 10) {
      newErrors.phone = "Phone must be 10 digits"
    }

    if (employee.department === "") {
      newErrors.department = "Select Department"
    }

    if (employee.salary === "") {
      newErrors.salary = "Salary Required"
    }

    if (employee.joiningDate === "") {
      newErrors.joiningDate = "Joining Date Required"
    }

    if (!isEdit && employee.password.length < 8) {
      newErrors.password = "Minimum 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function saveEmployee(e) {
    e.preventDefault()

    if (!validate()) {
      return
    }

    let data =JSON.parse(localStorage.getItem("employees")) || []

    if (isEdit) {
      data = data.map(emp => {
        if (emp.employeeId === currentId) {
          return {
            ...emp,
            ...employee
          }

        }
        return emp
      })

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Employee updated successfully."
      })
    }

    else {
      const newEmployee = {
        ...employee,
        employeeId:"EMP" +String(Date.now()).slice(-4)
      }

      data.push(newEmployee)

      Swal.fire({
        icon: "success",
        title: "Added",
        text: "Employee added successfully."
      })
    }

    localStorage.setItem("employees",JSON.stringify(data))

    setEmployees(data)
    closeModal()
  }

  function openAddModal() {
    setIsEdit(false)
    setCurrentId(null)
    setShowModal(true)
    setEmployee({
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      salary: "",
      joiningDate: "",
      password: "",
      remainingLeaves: 12,
      usedLeaves: 0,
      status: "Active",
      photo: ""
    })

    setErrors({})
  }

  function editEmployee(emp) {
    setIsEdit(true)
    setCurrentId(emp.employeeId)
    setShowModal(true)
    setEmployee(emp)
    setErrors({})
  }

  function closeModal() {
    setShowModal(false)
  }

  function deleteEmployee(id) {
    Swal.fire({
      title: "Delete Employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    }).then(result => {
      if (result.isConfirmed) {
        const updated = employees.filter(emp => emp.employeeId !== id)

        localStorage.setItem("employees",JSON.stringify(updated))

        setEmployees(updated)

        Swal.fire({
          icon: "success",
          title: "Deleted"
        })
      }
    })

  }

  function viewEmployee(emp) {
    Swal.fire({
      title: emp.name,
      html: `
      <p><b>ID :</b> ${emp.employeeId}</p>
      <p><b>Department :</b> ${emp.department}</p>
      <p><b>Email :</b> ${emp.email}</p>
      <p><b>Phone :</b> ${emp.phone}</p>
      <p><b>Salary :</b> ₹${emp.salary}</p>
      <p><b>Remaining Leaves :</b> ${emp.remainingLeaves}</p>
      `
    })

  }

  const filteredEmployees = employees.filter(emp => {
    const searchMatch =emp.name.toLowerCase().includes(search.toLowerCase())||emp.employeeId.toLowerCase().includes(search.toLowerCase())

    const deptMatch =department === "All"||emp.department === department

    const statusMatch =status === "All"||emp.status === status

    return searchMatch && deptMatch && statusMatch

  })

  return (

    <div className="employees-page">

      <div className="employees-header">
        <div>
          <h2>Employees</h2>
          <p>Manage all employees</p>
        </div>
        <button className="add-btn" onClick={openAddModal}><UserPlus size={18} />Add Employee</button>
      </div>

      <div className="employees-top">

        <div className="employee-search">
          <Search size={18} />
          <input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>

        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option>All</option>
          <option>Information Technology</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Marketing</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="employee-table">

        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Leaves</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {
              filteredEmployees.length > 0 ?
                filteredEmployees.map(emp => (
                  <tr key={emp.employeeId}>
                    <td><img className="emp-img" src={emp.photo ||`https://ui-avatars.com/api/?name=${emp.name}`} alt=""/></td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.remainingLeaves}</td>
                    <td><span className={`status ${emp.status.toLowerCase()}`}>{emp.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="view" onClick={() => viewEmployee(emp)}><Eye size={17} /></button>
                        <button className="edit" onClick={() => editEmployee(emp)}><Pencil size={17} /></button>
                        <button className="delete" onClick={() => deleteEmployee(emp.employeeId)}><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="9">No Employees Found</td>
                </tr>
            }
          </tbody>

        </table>

      </div>

      {
        showModal &&
        <div className="modal-overlay">

          <div className="employee-modal">
            <div className="modal-header">
              <h3>{isEdit?"Edit Employee":"Add Employee"}</h3>
              <button onClick={closeModal}><X size={20} /></button>
            </div>

            <form onSubmit={saveEmployee}>
              <div className="modal-grid">
                <div>
                  <label>Name</label>
                  <input type="text" name="name" value={employee.name} onChange={handleChange}/>
                  <small>{errors.name}</small>
                </div>

                <div>
                  <label>Email</label>
                  <input type="email" name="email" value={employee.email} onChange={handleChange}/>
                  <small>{errors.email}</small>
                </div>

                <div>
                  <label>Phone</label>
                  <input type="text" name="phone" value={employee.phone} onChange={handleChange}/>
                  <small>{errors.phone}</small>
                </div>

                <div>
                  <label>Department</label>
                  <select name="department" value={employee.department} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Information Technology</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                  </select>
                  <small>{errors.department}</small>
                </div>

                <div>
                  <label>Salary</label>
                  <input type="number" name="salary" value={employee.salary} onChange={handleChange}/>
                  <small>{errors.salary}</small>
                </div>

                <div>
                  <label>Joining Date</label>
                  <input type="date" name="joiningDate" value={employee.joiningDate} onChange={handleChange}/>
                  <small>{errors.joiningDate}</small>
                </div>
                {
                  !isEdit &&
                  <>
                    <div>
                      <label>Password</label>
                      <input type="password" name="password" value={employee.password} onChange={handleChange}/>
                      <small>{errors.password}</small>
                    </div>
                  </>
                }

                <div>
                  <label>Status</label>
                  <select name="status" value={employee.status} onChange={handleChange}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div className="full">
                  <label>Profile Photo</label>
                  <input type="file" accept=".jpg,.jpeg,.png" onChange={uploadPhoto}/>
                </div>
              </div>

              <div className="modal-buttons">
                <button type="submit">{isEdit?"Update Employee":"Add Employee"}</button>
              </div>

            </form>

          </div>

        </div>
      }
    </div>

  )
}

export default Employees
