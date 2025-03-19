import { useState, useEffect } from 'react'
import { FaSolarPanel, FaBatteryFull, FaPlug } from 'react-icons/fa'
import designHero from '../../assets/images/system-design.jpg'

function SystemDesign() {
  const [systemRequirements, setSystemRequirements] = useState({
    dailyConsumption: 0,
    peakHours: 5, // Average peak sun hours
    systemEfficiency: 0.8, // 80% system efficiency
  })

  const [designRecommendation, setDesignRecommendation] = useState({
    panelCount: 0,
    panelWattage: 400, // Standard panel wattage
    batteryCapacity: 0,
    inverterSize: 0
  })

  const [calculatorData, setCalculatorData] = useState({
    available: false,
    timestamp: null
  })

  // Calculate system specifications
  const calculateSystem = () => {
    const dailyEnergyNeeded = systemRequirements.dailyConsumption
    const requiredPower = (dailyEnergyNeeded * 1000) / systemRequirements.peakHours
    const totalPowerNeeded = requiredPower / systemRequirements.systemEfficiency

    const panelCount = Math.ceil(totalPowerNeeded / designRecommendation.panelWattage)
    const batteryCapacity = Math.ceil((dailyEnergyNeeded * 1.2) * 1000) // 20% extra capacity
    const inverterSize = Math.ceil(totalPowerNeeded * 1.2 / 1000) // 20% larger than panel array

    setDesignRecommendation({
      ...designRecommendation,
      panelCount,
      batteryCapacity,
      inverterSize
    })
  }

  useEffect(() => {
    // Get consumption data from localStorage
    const savedConsumption = localStorage.getItem('dailyConsumption')
    const timestamp = localStorage.getItem('calculatorTimestamp')

    if (savedConsumption) {
      setSystemRequirements(prev => ({
        ...prev,
        dailyConsumption: parseFloat(savedConsumption)
      }))
      setCalculatorData({
        available: true,
        timestamp: new Date(timestamp)
      })
    }
  }, [])

  useEffect(() => {
    calculateSystem()
  }, [systemRequirements])

  return (
    <div className="system-design">
      <div
        className="design-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${designHero})`
        }}
      >
        <div className="design-header">
          <h1>Custom Solar System Design</h1>
          <p>Optimized for your energy needs</p>
        </div>
      </div>

      <div className="design-content">
        <div className="design-requirements">
          <h2>System Requirements</h2>
          {calculatorData.available && (
            <div className="calculator-data-notice">
              <p>
                ℹ️ Daily consumption value is from your calculator results
                ({calculatorData.timestamp.toLocaleDateString()} at {calculatorData.timestamp.toLocaleTimeString()})
              </p>
              <button
                className="clear-calculator-data"
                onClick={() => {
                  localStorage.removeItem('dailyConsumption')
                  localStorage.removeItem('calculatorTimestamp')
                  setSystemRequirements(prev => ({ ...prev, dailyConsumption: 0 }))
                  setCalculatorData({ available: false, timestamp: null })
                }}
              >
                Clear Calculator Data
              </button>
            </div>
          )}
          <div className="requirements-grid">
            <div className="requirement-input">
              <label>Daily Energy Consumption (kWh)</label>
              <input
                type="number"
                value={systemRequirements.dailyConsumption}
                onChange={(e) => setSystemRequirements(prev => ({
                  ...prev,
                  dailyConsumption: parseFloat(e.target.value) || 0
                }))}
              />
            </div>
            <div className="requirement-input">
              <label>Peak Sun Hours</label>
              <input
                type="number"
                value={systemRequirements.peakHours}
                onChange={(e) => setSystemRequirements(prev => ({
                  ...prev,
                  peakHours: parseFloat(e.target.value) || 0
                }))}
              />
            </div>
          </div>
        </div>

        <div className="design-recommendations">
          <h2>Recommended System Design</h2>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <FaSolarPanel className="recommendation-icon" />
              <h3>Solar Array</h3>
              <div className="recommendation-details">
                <p>Number of Panels: <strong>{designRecommendation.panelCount}</strong></p>
                <p>Panel Wattage: <strong>{designRecommendation.panelWattage}W</strong></p>
                <p>Total Capacity: <strong>{(designRecommendation.panelCount * designRecommendation.panelWattage / 1000).toFixed(1)} kW</strong></p>
              </div>
            </div>

            <div className="recommendation-card">
              <FaBatteryFull className="recommendation-icon" />
              <h3>Battery Storage</h3>
              <div className="recommendation-details">
                <p>Capacity: <strong>{(designRecommendation.batteryCapacity / 1000).toFixed(1)} kWh</strong></p>
                <p>Recommended Type: <strong>Lithium-Ion</strong></p>
                <p>Days of Autonomy: <strong>1.2</strong></p>
              </div>
            </div>

            <div className="recommendation-card">
              <FaPlug className="recommendation-icon" />
              <h3>Inverter</h3>
              <div className="recommendation-details">
                <p>Size: <strong>{designRecommendation.inverterSize} kW</strong></p>
                <p>Type: <strong>Hybrid Inverter</strong></p>
                <p>Efficiency: <strong>97%</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemDesign 