import React from "react"
import "./Salary.css"
import { IndianRupee, Wallet, BadgeDollarSign, CircleCheck } from "lucide-react"

const Salary = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {}

  const salaryHistory = JSON.parse(localStorage.getItem("salaryHistory")) || []

  const mySalaryHistory = salaryHistory.filter(item => item.employeeId === currentUser.employeeId).reverse()

  const salary = currentUser.salary || 40000

  const deduction = currentUser.salaryDeduction || 0

  const deductionReason = currentUser.deductionReason || "No Deduction"

  const netSalary = salary - deduction

  const status = deduction >= 0 ? "Paid" : "Pending"

  return (

    <div className="salary-page">

      <div className="salary-header">
        <h2>Salary</h2>
        <p>View your salary details</p>
      </div>

      <div className="salary-cards">
        <div className="salary-card">
          <IndianRupee size={30} />
          <h4>Current Salary</h4>
          <h2>₹{salary}</h2>
        </div>

        <div className="salary-card">
          <Wallet size={30} />
          <h4>Net Salary</h4>
          <h2>₹{netSalary}</h2>
        </div>

        <div className="salary-card">
          <BadgeDollarSign size={30} />
          <h4>Deduction</h4>
          <h2>₹{deduction}</h2>
        </div>

        <div className="salary-card">
          <CircleCheck size={30} />
          <h4>Status</h4>
          <span className="paid">{status}</span>
        </div>
      </div>

      <div className="salary-summary">
        <h3>Salary Summary</h3>
        <div className="summary-row">
          <span>Current Salary</span>
          <strong>₹{salary}</strong>
        </div>

        <div className="summary-row">
          <span>Deduction</span>
          <strong>₹{deduction}</strong>
        </div>

        <div className="summary-row">
          <span>Net Salary</span>
          <strong>₹{netSalary}</strong>
        </div>

        <div className="summary-row">
          <span>Salary Month</span>
          <strong>July 2026</strong>
        </div>

        <div className="summary-row">
          <span>Payment Status</span>
          <strong className="paid">{status}</strong>
        </div>
      </div>

      <div className="deduction-box">
        <h3>Deduction Details</h3>
        <p><strong>Reason :</strong>{" "}{deductionReason}</p>
      </div>

      <div className="history-table">
        <h3>Salary History</h3>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Salary</th>
              <th>Deduction</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {
              mySalaryHistory.length > 0 ?
                mySalaryHistory.map(item => (
                  <tr key={item.id}>
                    <td>{item.month}</td>
                    <td>₹{item.salary}</td>
                    <td>₹{item.deduction}</td>
                    <td>₹{item.netSalary}</td>
                    <td><span className="paid">{item.status}</span></td>
                    <td><span className={item.action === "Created" ? "created" : "updated"}>{item.action}</span></td>
                    <td>{item.updatedAt}</td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="7">No Salary Records Found</td>
                </tr>
            }
          </tbody>

        </table>

      </div>

    </div>

  )
}

export default Salary