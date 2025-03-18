function LiveMonitoring() {
  return (
    <div className="live-monitoring">
      <h2>Live System Monitoring</h2>
      <div className="monitoring-dashboard">
        <div className="metric-card">
          <h3>Current Output</h3>
          <p>0 kW</p>
        </div>
        <div className="metric-card">
          <h3>Today's Generation</h3>
          <p>0 kWh</p>
        </div>
        <div className="metric-card">
          <h3>System Status</h3>
          <p className="status good">Operational</p>
        </div>
      </div>
    </div>
  )
}

export default LiveMonitoring 