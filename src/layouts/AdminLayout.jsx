import React, { useState } from "react"
import { Outlet } from "react-router-dom"

import AdminSidebar from "../components/AdminSidebar"
import AdminNavbar from "../components/AdminNavbar"

import "./AdminLayout.css"

const AdminLayout = () => {

  const [collapse, setCollapse] = useState(false)

  return (

    <div className="admin-layout">
      <AdminSidebar collapse={collapse}/>

      <div className={ collapse ? "admin-main collapse" : "admin-main"}>
        <AdminNavbar collapse={collapse} setCollapse={setCollapse}/>

        <div className="admin-content">
          <Outlet />
        </div>

      </div>

    </div>

  )
}

export default AdminLayout