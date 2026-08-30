import React, { useState } from "react"
import "./Profile.css"
import Swal from "sweetalert2"

const Profile = () => {

  const currentUser =JSON.parse(localStorage.getItem("currentUser")) || {}

  const employees =JSON.parse(localStorage.getItem("employees")) || []

  const [profile, setProfile] = useState({
    employeeId: currentUser.employeeId || "",
    name: currentUser.name || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    department: currentUser.department || "",
    joiningDate: currentUser.joiningDate || "",
    password: "",
    confirmPassword: "",
    photo: currentUser.photo || ""
  })

  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value
    })
  }

  function uploadPhoto(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile(prev => ({
          ...prev,
          photo: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  function validate() {
    let newErrors = {}

    if (profile.name === "") {
      newErrors.name = "Name is required"
    }

    if (profile.email === "") {
      newErrors.email = "Email is required"
    }

    if (profile.phone === "") {
      newErrors.phone = "Phone Number is required"
    }

    else if (profile.phone.length !== 10) {
      newErrors.phone = "Phone Number must be 10 digits"
    }

    if (profile.password !== "" && profile.password.length < 8) {
      newErrors.password = "Minimum 8 characters"
    }

    if (profile.password !== profile.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function saveProfile(e) {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const updatedUser = {
      ...currentUser,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      photo: profile.photo,
      ...(profile.password && { password: profile.password })
    }

    localStorage.setItem("currentUser",JSON.stringify(updatedUser))

    const updatedEmployees = employees.map(emp => {
      if (emp.employeeId === profile.employeeId) {
        return {
          ...emp,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          photo: profile.photo,
          ...(profile.password && { password: profile.password })
        }
      }
      return emp
    })

    localStorage.setItem("employees",JSON.stringify(updatedEmployees))

    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      text: "Your profile has been updated successfully."
    })

    setProfile({
      ...profile,
      password: "",
      confirmPassword: ""
    })
  }

  function resetForm() {

    setProfile({
      employeeId: currentUser.employeeId || "",
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      department: currentUser.department || "",
      joiningDate: currentUser.joiningDate || "",
      password: "",
      confirmPassword: "",
      photo: currentUser.photo || ""
    })

    setErrors({})
  }

  return (

    <div className="profile-page">

      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your personal information</p>
      </div>

      <form className="profile-form" onSubmit={saveProfile}>

        <div className="profile-photo">
          <img src={ profile.photo || "https://ui-avatars.com/api/?name=Employee&background=10b981&color=fff"} alt="profile"/>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={uploadPhoto}/>
        </div>

        <div className="profile-grid">
          <div className="profile-group">
            <label>Employee ID</label>
            <input type="text" value={profile.employeeId} readOnly/>
          </div>

          <div className="profile-group">
            <label>Department</label>
            <input type="text" value={profile.department} readOnly/>
          </div>

          <div className="profile-group">
            <label>Joining Date</label>
            <input type="text" value={profile.joiningDate} readOnly/>
          </div>

          <div className="profile-group">
            <label>Name</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange}/>
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="profile-group">
            <label>Email</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange}/>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="profile-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={profile.phone} onChange={handleChange}/>
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <div className="profile-group">
            <label>New Password</label>
            <input type="password" name="password" value={profile.password} onChange={handleChange}/>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="profile-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={profile.confirmPassword} onChange={handleChange}/>
            {errors.confirmPassword &&
              <p className="error">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="profile-buttons">
          <button type="submit">Save Changes</button>
          <button type="button" className="reset-btn" onClick={resetForm}>Reset</button>
        </div>

      </form>

    </div>

  )
}

export default Profile