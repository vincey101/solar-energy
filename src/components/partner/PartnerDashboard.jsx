import { useState, useEffect } from 'react'
import { FaWallet, FaProjectDiagram, FaMoneyBillWave } from 'react-icons/fa'

function PartnerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingPayments: 0,
    recentTransactions: []
  })

  return (
    <div className="partner-dashboard">
      <h1>Partner Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <FaWallet className="stat-icon" />
          <div className="stat-info">
            <h3>Total Balance</h3>
            <p className="stat-value">₦{dashboardData.totalBalance.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FaProjectDiagram className="stat-icon" />
          <div className="stat-info">
            <h3>Active Projects</h3>
            <p className="stat-value">{dashboardData.activeProjects}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FaMoneyBillWave className="stat-icon" />
          <div className="stat-info">
            <h3>Pending Payments</h3>
            <p className="stat-value">₦{dashboardData.pendingPayments.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentTransactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.projectName}</td>
                <td>₦{tx.amount.toLocaleString()}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PartnerDashboard 