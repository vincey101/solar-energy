import { useState, useEffect } from 'react'
import { FaPlus, FaMinus, FaCalculator, FaLightbulb, FaChartLine, FaClock } from 'react-icons/fa'
import { gadgets } from './GadgetLibrary'  // Now this will work
import calculatorHero from '../../assets/images/calculator.jpg'  // Add this import
import { energyAI } from '../../services/energyAI'

function Calculator() {
  const [selectedGadgets, setSelectedGadgets] = useState([])
  const [totalPower, setTotalPower] = useState(0)
  const [dailyConsumption, setDailyConsumption] = useState(0)
  const [yearlyConsumption, setYearlyConsumption] = useState(0)
  const [predictions, setPredictions] = useState({
    peakHours: 'Analyzing usage patterns...',
    monthlyTrend: 'Calculating consumption trends...',
    optimization: 'Evaluating efficiency...'
  })
  const [customGadget, setCustomGadget] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(null)

  const addGadget = (gadget) => {
    setSelectedGadgets([
      ...selectedGadgets,
      { ...gadget, quantity: 1, customHours: gadget.avgDailyUsage }
    ])
  }

  const removeGadget = (index) => {
    setSelectedGadgets(selectedGadgets.filter((_, i) => i !== index))
  }

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return
    const updated = selectedGadgets.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    )
    setSelectedGadgets(updated)
  }

  const updateHours = (index, hours) => {
    const parsedHours = parseFloat(hours)
    if (isNaN(parsedHours) || parsedHours < 0 || parsedHours > 24) return
    const updated = selectedGadgets.map((item, i) =>
      i === index ? { ...item, customHours: parsedHours } : item
    )
    setSelectedGadgets(updated)
  }

  useEffect(() => {
    const calculations = selectedGadgets.reduce((acc, gadget) => {
      const power = gadget.powerRating * gadget.quantity
      const daily = power * gadget.customHours
      const yearly = daily * 365

      return {
        totalPower: acc.totalPower + power,
        dailyConsumption: acc.dailyConsumption + daily,
        yearlyConsumption: acc.yearlyConsumption + yearly
      }
    }, { totalPower: 0, dailyConsumption: 0, yearlyConsumption: 0 })

    setTotalPower(calculations.totalPower)
    setDailyConsumption(calculations.dailyConsumption)
    setYearlyConsumption(calculations.yearlyConsumption)

    // Save to localStorage
    localStorage.setItem('dailyConsumption', calculations.dailyConsumption.toString())
    localStorage.setItem('calculatorTimestamp', new Date().toISOString())
  }, [selectedGadgets])

  useEffect(() => {
    const navbar = document.querySelector('.navbar')
    navbar.classList.add('navbar-white')

    return () => {
      navbar.classList.remove('navbar-white')
    }
  }, [])

  useEffect(() => {
    async function initializeAI() {
      try {
        await energyAI.initialize()
      } catch (error) {
        console.error('Failed to initialize AI model:', error)
      }
    }
    initializeAI()
  }, [])

  useEffect(() => {
    async function updatePredictions() {
      if (selectedGadgets.length > 0) {
        try {
          const predictions = await energyAI.predict(selectedGadgets)
          setPredictions(predictions)
        } catch (error) {
          console.error('Failed to update predictions:', error)
          setPredictions({
            peakHours: 'Unable to analyze at this time',
            monthlyTrend: 'Unable to analyze at this time',
            optimization: 'Unable to analyze at this time'
          })
        }
      } else {
        setPredictions({
          peakHours: 'Add gadgets to see usage analysis',
          monthlyTrend: 'Add gadgets to see consumption trends',
          optimization: 'Add gadgets to see optimization tips'
        })
      }
    }
    updatePredictions()
  }, [selectedGadgets])

  const handleCustomGadgetSearch = async (e) => {
    e.preventDefault()
    if (!customGadget.trim()) return

    setIsSearching(true)
    try {
      const result = await energyAI.searchGadget(customGadget)
      if (result) {
        setSearchResults(result)
        const newGadget = {
          id: `custom-${Date.now()}`,
          name: result.name,
          powerRating: result.estimatedWattage / 1000, // Convert to kW
          avgDailyUsage: result.suggestedHours,
          category: result.type,
          efficiency: result.confidence > 0.8 ? 'A+' : 'B',
          brand: 'Generic',
          model: 'Custom'
        }
        addGadget(newGadget)

        // Clear search results after a short delay
        setTimeout(() => {
          setSearchResults(null)
        }, 2000) // Clear after 2 seconds
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
      setCustomGadget('')
    }
  }

  return (
    <div className="calculator">
      <div
        className="calculator-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${calculatorHero})`
        }}
      >
        <div className="calculator-header">
          <h1>Calculator & Energy Assessment</h1>
          <p className="calculator-subtitle">
            Calculate your power requirements and get AI-powered energy consumption insights
          </p>
        </div>
      </div>

      <div className="calculator-content">
        <div className="calculator-main">
          <div className="gadget-picker">
            <select
              className="gadget-select"
              onChange={(e) => {
                const gadget = gadgets.find(g => g.id === parseInt(e.target.value))
                if (gadget) addGadget(gadget)
                e.target.value = '' // Reset select after adding
              }}
              value=""
            >
              <option value="">Select a gadget to add...</option>
              {gadgets.map(gadget => (
                <option key={gadget.id} value={gadget.id}>
                  {gadget.name} ({gadget.powerRating} kW)
                </option>
              ))}
            </select>
          </div>

          <div className="custom-gadget-search">
            <form onSubmit={handleCustomGadgetSearch}>
              <input
                type="text"
                value={customGadget}
                onChange={(e) => setCustomGadget(e.target.value)}
                placeholder="AI Search for any gadget..."
                className="custom-gadget-input"
              />
              <button type="submit" disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Add Gadget'}
              </button>
            </form>
            {searchResults && (
              <div className="search-results">
                <p>Found: {searchResults.name}</p>
                <p>Estimated Power: {searchResults.estimatedWattage}W</p>
                <p>Confidence: {(searchResults.confidence * 100).toFixed(1)}%</p>
              </div>
            )}
          </div>

          <div className="selected-gadgets">
            {selectedGadgets.length === 0 ? (
              <p className="no-gadgets">No gadgets selected yet</p>
            ) : (
              selectedGadgets.map((gadget, index) => (
                <div key={index} className="selected-item">
                  <div className="gadget-details">
                    <h3>{gadget.name}</h3>
                    <p className="gadget-brand">{gadget.brand} - {gadget.model}</p>
                    <p className="gadget-consumption">
                      Power: {gadget.powerRating} kW × {gadget.quantity} × {gadget.customHours}hr = {(gadget.powerRating * gadget.quantity * gadget.customHours).toFixed(2)} kWh/day
                    </p>
                  </div>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(index, gadget.quantity - 1)}>
                      <FaMinus />
                    </button>
                    <span>{gadget.quantity}</span>
                    <button onClick={() => updateQuantity(index, gadget.quantity + 1)}>
                      <FaPlus />
                    </button>
                  </div>
                  <div className="hours-wrapper">
                    <span className="hours-label">Hours/day</span>
                    <input
                      type="number"
                      className="hours-input"
                      value={gadget.customHours}
                      onChange={(e) => updateHours(index, e.target.value)}
                      min="0"
                      max="24"
                      step="0.5"
                    />
                  </div>
                  <button
                    className="remove-gadget"
                    onClick={() => removeGadget(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="calculator-results">
            <div className="result-item">
              <span>Total Power Required</span>
              <strong>{totalPower.toFixed(2)} kW</strong>
            </div>
            <div className="result-item">
              <span>Daily Consumption</span>
              <strong>{dailyConsumption.toFixed(2)} kWh</strong>
            </div>
            <div className="result-item">
              <span>Yearly Consumption</span>
              <strong>{(yearlyConsumption).toFixed(2)} kWh</strong>
            </div>
          </div>

          <div className="ai-predictions">
            <h2>AI Energy Insights</h2>
            <div className="predictions-grid">
              <div className={`prediction-card`}>
                <FaClock className="prediction-icon" />
                <h3>Peak Usage Hours</h3>
                <p>{predictions.peakHours}</p>
              </div>
              <div className={`prediction-card`}>
                <FaChartLine className="prediction-icon" />
                <h3>Monthly Trend</h3>
                <p>{predictions.monthlyTrend}</p>
              </div>
              <div className={`prediction-card`}>
                <FaLightbulb className="prediction-icon" />
                <h3>Optimization Tips</h3>
                <p>{predictions.optimization}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator 