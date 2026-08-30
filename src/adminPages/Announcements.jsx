import React, { useEffect, useState } from "react"
import "./Announcements.css"
import Swal from "sweetalert2"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

const Announcements = () => {

  const [announcements, setAnnouncements] = useState([])

  const [search, setSearch] = useState("")

  const [showModal, setShowModal] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  const [currentId, setCurrentId] = useState(null)

  const [errors, setErrors] = useState({})

  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
    priority: "Medium",
    department: "All",
    expiryDate: ""
  })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("announcements")) || []
    setAnnouncements(data)
  }, [])

  function handleChange(e) {
    const { name, value } = e.target;
    setAnnouncement({
      ...announcement,
      [name]: value
    })
  }

  function openAddModal() {
    setShowModal(true)
    setIsEdit(false)
    setCurrentId(null)
    setErrors({})
    setAnnouncement({
      title: "",
      description: "",
      priority: "Medium",
      department: "All",
      expiryDate: ""
    })
  }

  function editAnnouncement(item) {
    setShowModal(true)
    setIsEdit(true)
    setCurrentId(item.id)
    setAnnouncement(item)
    setErrors({})
  }

  function closeModal() {
    setShowModal(false)
  }

  function validate() {

    let newErrors = {}

    if (announcement.title === "") {
      newErrors.title = "Title Required"
    }

    if (announcement.description === "") {
      newErrors.description = "Description Required"
    }

    if (announcement.expiryDate === "") {
      newErrors.expiryDate = "Expiry Date Required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function saveAnnouncement(e) {

    e.preventDefault()

    if (!validate()) {
      return
    }

    let data = JSON.parse(localStorage.getItem("announcements")) || []

    if (isEdit) {
      data = data.map(item => {
        if (item.id === currentId) {
          return {
            ...item,
            ...announcement
          }
        }
        return item
      })

      Swal.fire({
        icon: "success",
        title: "Announcement Updated"
      })
    }

    else {
      data.unshift({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        ...announcement
      })

      Swal.fire({
        icon: "success",
        title: "Announcement Published"
      })
    }

    localStorage.setItem("announcements", JSON.stringify(data))

    setAnnouncements(data)
    closeModal()

    let notifications = JSON.parse(localStorage.getItem("notifications")) || []

    notifications.push({
      id: Date.now(),
      role: "employee",
      employeeId: "ALL",
      title: "New Announcement",
      message: announcement.title,
      date: new Date().toLocaleDateString(),
      read: false
    })

    localStorage.setItem("notifications", JSON.stringify(notifications))
  }

  function deleteAnnouncement(id) {
    Swal.fire({
      title: "Delete Announcement?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    }).then(result => {
      if (result.isConfirmed) {
        const updated = announcements.filter(item => item.id !== id)

        localStorage.setItem("announcements", JSON.stringify(updated))

        setAnnouncements(updated)

        Swal.fire({
          icon: "success",
          title: "Deleted"
        })
      }
    })
  }

  const filteredAnnouncements = announcements.filter(item => item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase()))

  return (

    <div className="announcement-page">

      <div className="announcement-header">
        <div>
          <h2>Announcements</h2>
          <p>Create and manage company announcements</p>
        </div>
        <button className="add-btn" onClick={openAddModal}><Plus size={18} />Add Announcement</button>
      </div>

      <div className="announcement-top">
        <div className="announcement-search">
          <Search size={18} />
          <input type="text" placeholder="Search Announcement" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="announcement-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Expiry</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
              filteredAnnouncements.length > 0 ?
                filteredAnnouncements.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="announcement-info">
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </div>
                    </td>
                    <td>{item.department}</td>
                    <td><span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span></td>
                    <td>{item.expiryDate}</td>
                    <td>{item.date}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => editAnnouncement(item)}><Pencil size={17} /></button>
                        <button className="delete-btn" onClick={() => deleteAnnouncement(item.id)}><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="6">No Announcements Found</td>
                </tr>
            }
          </tbody>
        </table>

      </div>

      {
        showModal &&
        <div className="modal-overlay">
          <div className="announcement-modal">
            <h3>{isEdit ? "Edit Announcement" : "New Announcement"}</h3>

            <form onSubmit={saveAnnouncement}>

              <div className="modal-grid">
                <div className="full">
                  <label>Title</label>
                  <input type="text" name="title" value={announcement.title} onChange={handleChange} />
                  <small>{errors.title}</small>
                </div>

                <div className="full">
                  <label>Description</label>
                  <textarea rows="4" name="description" value={announcement.description} onChange={handleChange}></textarea>
                  <small>{errors.description}</small>
                </div>

                <div>
                  <label>Priority</label>
                  <select name="priority" value={announcement.priority} onChange={handleChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <label>Department</label>
                  <select name="department" value={announcement.department} onChange={handleChange}>
                    <option>All</option>
                    <option>HR</option>
                    <option>IT</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                  </select>
                </div>

                <div className="full">
                  <label>Expiry Date</label>
                  <input type="date" name="expiryDate" value={announcement.expiryDate} onChange={handleChange} />
                  <small>{errors.expiryDate}</small>
                </div>
              </div>

              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="save-btn">{isEdit ? "Update" : "Publish"}</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>

  )
}

export default Announcements