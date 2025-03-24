import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChevronUp, FaChevronDown, FaHome, FaIndustry, FaBuilding, FaSearch, FaPlus, FaMinus } from 'react-icons/fa'
import { energyAI } from '../../services/energyAI'
import { locationService } from '../../services/locationService'
import { googlePlacesService } from '../../services/googlePlacesService'

function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [customGadget, setCustomGadget] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [selectedGadgets, setSelectedGadgets] = useState([])
  const [totalPower, setTotalPower] = useState(0)
  const [paymentOption, setPaymentOption] = useState('')
  const [location, setLocation] = useState(null)
  const [solarCompanies, setSolarCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const navigate = useNavigate()

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleRegisteredUser = (isRegistered) => {
    if (isRegistered) {
      setStep(2)
    } else {
      setStep(3)
    }
  }

  const handleUserType = (type) => {
    if (step === 2) {
      // Registered user flow
      if (type === 'customer') {
        navigate('/customer/login')
      } else {
        navigate('/partner/login')
      }
    } else {
      // New user flow
      if (type === 'customer') {
        setStep(4) // Go to power intention question
      } else {
        navigate('/get-started?type=partner')
      }
    }
  }

  const handleCustomGadgetSearch = async (e) => {
    e.preventDefault()
    if (!customGadget.trim()) return

    setIsSearching(true)
    try {
      const result = await energyAI.searchGadget(customGadget)
      if (result) {
        setSearchResults(result)
        const newGadget = {
          name: result.name,
          powerRating: result.estimatedWattage / 1000, // Convert to kW
          quantity: 1,
          customHours: 1,
          brand: 'Generic',
          model: 'Custom'
        }
        setSelectedGadgets([...selectedGadgets, newGadget])
        updateTotalPower([...selectedGadgets, newGadget])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
      setCustomGadget('')
      setSearchResults(null)
    }
  }

  const updateTotalPower = (gadgets) => {
    const total = gadgets.reduce((sum, gadget) => {
      return sum + (gadget.powerRating * gadget.quantity)
    }, 0)
    setTotalPower(total)
  }

  const removeGadget = (index) => {
    const updatedGadgets = selectedGadgets.filter((_, i) => i !== index)
    setSelectedGadgets(updatedGadgets)
    updateTotalPower(updatedGadgets)
  }

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return
    const updatedGadgets = selectedGadgets.map((gadget, i) =>
      i === index ? { ...gadget, quantity: newQuantity } : gadget
    )
    setSelectedGadgets(updatedGadgets)
    updateTotalPower(updatedGadgets)
  }

  const handleNext = () => {
    if (selectedGadgets.length > 0) {
      setStep(5) // Move to payment options instead of navigating away
    }
  }

  const handlePaymentSelection = () => {
    // Move to solar companies selection instead of navigating away
    setStep(6)
    detectLocation()
  }

  const detectLocation = async () => {
    try {
      const coords = await locationService.getLocation()
      const locationDetails = await locationService.reverseGeocode(
        coords.latitude,
        coords.longitude
      )
      setLocation(locationDetails)
      // Fetch solar companies based on location
      fetchSolarCompanies(locationDetails)
    } catch (error) {
      console.error('Location detection failed:', error)
      // Fallback to manual location input or default companies
    }
  }

  const fetchSolarCompanies = async (location) => {
    try {
      const companies = await googlePlacesService.searchSolarCompanies(
        location.latitude,
        location.longitude
      )
      setSolarCompanies(companies)
    } catch (error) {
      console.error('Failed to fetch solar companies:', error)
      setSolarCompanies([])
    }
  }

  const handleCompanySelection = (company) => {
    setSelectedCompany(company)
  }

  const handleFinalSubmit = () => {
    navigate(`/get-started?type=user&gadgets=${encodeURIComponent(JSON.stringify(selectedGadgets))}&payment=${paymentOption}&company=${encodeURIComponent(JSON.stringify(selectedCompany))}`)
  }

  return (
    <div className="onboarding-flow">
      <div className="onboarding-content">
        <div className="navigation-arrows">
          {step > 1 && (
            <button className="nav-arrow up" onClick={handleBack}>
              <FaChevronUp />
            </button>
          )}
          <button className="nav-arrow down">
            <FaChevronDown />
          </button>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h2>Are you a registered user?</h2>
            <div className="onboarding-buttons">
              <button onClick={() => handleRegisteredUser(true)}>
                Yes, I am registered
              </button>
              <button onClick={() => handleRegisteredUser(false)}>
                No, I'm new here
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h2>Are you a customer or a Solar Seller?</h2>
            <div className="onboarding-buttons">
              <button onClick={() => handleUserType('customer')}>
                I'm a Customer
              </button>
              <button onClick={() => handleUserType('seller')}>
                I'm a Solar Seller
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <h2>Are you a solar seller or a user?</h2>
            <div className="onboarding-buttons">
              <button onClick={() => handleUserType('seller')}>
                Solar Vendor/Seller
              </button>
              <button onClick={() => handleUserType('customer')}>
                Solar User (Home/Business Owner)
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-step">
            <h2>What do you intend to power?</h2>
            <div className="onboarding-gadget-search">
              <form onSubmit={handleCustomGadgetSearch}>
                <div className="onboarding-search-wrapper">
                  <input
                    type="text"
                    value={customGadget}
                    onChange={(e) => setCustomGadget(e.target.value)}
                    placeholder="AI Search for any gadget..."
                    className="onboarding-search-input"
                  />
                  <button type="submit" className="onboarding-search-button" disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Add Gadget'}
                  </button>
                </div>
              </form>
              {searchResults && (
                <div className="onboarding-search-results">
                  <p>Found: {searchResults.name}</p>
                  <p>Estimated Power: {searchResults.estimatedWattage}W</p>
                  <p>Confidence: {(searchResults.confidence * 100).toFixed(1)}%</p>
                </div>
              )}
            </div>

            <div className="onboarding-selected-gadgets">
              {selectedGadgets.length === 0 ? (
                <p className="onboarding-no-gadgets">No gadgets selected yet</p>
              ) : (
                selectedGadgets.map((gadget, index) => (
                  <div key={index} className="onboarding-gadget-item">
                    <div className="onboarding-gadget-details">
                      <h3>{gadget.name}</h3>
                      <p className="onboarding-gadget-power">
                        Power: {gadget.powerRating} kW × {gadget.quantity} = {(gadget.powerRating * gadget.quantity).toFixed(2)} kW
                      </p>
                    </div>
                    <div className="onboarding-quantity-control">
                      <button onClick={() => updateQuantity(index, gadget.quantity - 1)}>
                        <FaMinus />
                      </button>
                      <span>{gadget.quantity}</span>
                      <button onClick={() => updateQuantity(index, gadget.quantity + 1)}>
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      className="onboarding-remove-gadget"
                      onClick={() => removeGadget(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {selectedGadgets.length > 0 && (
              <div className="onboarding-power-summary">
                <div className="onboarding-total-power">
                  <span>Total Power Required:</span>
                  <strong>{totalPower.toFixed(2)} kW</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="onboarding-step">
            <h2>Select Your Payment Option</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="outright"
                  checked={paymentOption === 'outright'}
                  onChange={(e) => setPaymentOption(e.target.value)}
                />
                <div className="payment-content">
                  <span className="payment-title">Outright (Pay full amount at once)</span>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="financing"
                  checked={paymentOption === 'financing'}
                  onChange={(e) => setPaymentOption(e.target.value)}
                />
                <div className="payment-content">
                  <span className="payment-title">Financing (Pay in installments)</span>
                </div>
              </label>
            </div>

            {paymentOption && (
              <button
                className="onboarding-next-button"
                onClick={handlePaymentSelection}
              >
                Next
              </button>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="onboarding-step">
            <h2>Available Solar Companies Near You</h2>
            {location && (
              <p className="location-info">
                Showing results for {location.city}, {location.state}
              </p>
            )}
            <div className="solar-companies-grid">
              {solarCompanies.map((company) => (
                <div
                  key={company.id}
                  className={`company-card ${selectedCompany?.id === company.id ? 'selected' : ''}`}
                  onClick={() => handleCompanySelection(company)}
                >
                  <h3>{company.name}</h3>
                  <div className="company-rating">
                    Rating: {company.rating}/5
                  </div>
                  <div className="company-packages">
                    {company.packages.map((pkg, index) => (
                      <div key={index} className="package-item">
                        <h4>{pkg.name}</h4>
                        <p className="package-capacity">{pkg.capacity}</p>
                        <p className="package-price">{pkg.price}</p>
                        <ul className="package-features">
                          {pkg.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {selectedCompany && (
              <button
                className="onboarding-next-button"
                onClick={handleFinalSubmit}
              >
                Continue with {selectedCompany.name}
              </button>
            )}
          </div>
        )}

        <div className="progress-indicator">
          <div className="progress-text">
            {step === 1 ? '0%' :
              step === 2 ? '25%' :
                step === 3 ? '50%' :
                  step === 4 ? '75%' :
                    step === 5 ? '87.5%' : '100%'} completed
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: step === 1 ? '0%' :
                  step === 2 ? '25%' :
                    step === 3 ? '50%' :
                      step === 4 ? '75%' :
                        step === 5 ? '87.5%' : '100%'
              }}
            />
          </div>
        </div>

        {step === 4 && selectedGadgets.length > 0 && (
          <button className="onboarding-next-button" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default OnboardingFlow 