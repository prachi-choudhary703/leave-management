import React, { useState } from "react"
import { Outlet } from "react-router-dom"

import EmployeeSidebar from "../components/EmployeeSidebar"
import EmployeeNavbar from "../components/EmployeeNavbar"

import "./EmployeeLayout.css"

const EmployeeLayout = () => {

  const [collapse, setCollapse] = useState(false)

  return (

    <div className="employee-layout">
      <EmployeeSidebar collapse={collapse}/>

      <div className={ collapse ? "employee-main collapse" : "employee-main" }>
        <EmployeeNavbar collapse={collapse} setCollapse={setCollapse}/>

        <div className="employee-content">
          <Outlet />
        </div>

      </div>

    </div>

  )
}

export default EmployeeLayout