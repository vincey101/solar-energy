import { useState, useEffect } from 'react'

function SystemMonitoring() {
  const [systemStats, setSystemStats] = useState({
    currentOutput: 0,
    dailyProduction: 0,
    systemHealth: 'Good',
    alerts: [],
  })

  const [maintenanceSchedule, setMaintenanceSchedule] = useState([])

  return (
    <div className="system-monitoring">
      <h2>System Monitoring</h2>
      
      <div className="system-stats">
        <div className="stat-card">
          <h3>Current Output</h3>
          <p>{systemStats.currentOutput} kW</p>
        </div>
        <div className="stat-card">
          <h3>Daily Production</h3>
          <p>{systemStats.dailyProduction} kWh</p>
        </div>
        <div className="stat-card">
          <h3>System Health</h3>
          <p className={`health-status ${systemStats.systemHealth.toLowerCase()}`}>
            {systemStats.systemHealth}
          </p>
        </div>
      </div>

      <div className="alerts-section">
        <h3>System Alerts</h3>
        {systemStats.alerts.map((alert, index) => (
          <div key={index} className={`alert-item ${alert.severity}`}>
            <p>{alert.message}</p>
            <span>{alert.date}</span>
          </div>
        ))}
      </div>

      <div className="maintenance-schedule">
        <h3>Maintenance Schedule</h3>
        {maintenanceSchedule.map((item, index) => (
          <div key={index} className="maintenance-item">
            <p>{item.task}</p>
            <span>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemMonitoring 