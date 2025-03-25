import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChevronUp, FaChevronDown, FaHome, FaIndustry, FaBuilding, FaSearch, FaPlus, FaMinus } from 'react-icons/fa'
import { energyAI } from '../../services/energyAI'
import { locationService } from '../../services/locationService'
import { googlePlacesService } from '../../services/googlePlacesService'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const formatDistance = (meters) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(1) + ' miles';
}

const formatOpeningHours = (hours) => {
  if (!hours) return 'Hours not available';
  const now = new Date();
  const day = now.getDay();
  return hours[day] || 'Hours not available';
}

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
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(null)
  const [lat, setLat] = useState(null)
  const [zoom, setZoom] = useState(12)
  const [nearbyCompanies, setNearbyCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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
          hours: 1, // Add default hours
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
      const hours = gadget.hours || 1 // Fallback to 1 if hours is undefined
      return sum + (gadget.powerRating * gadget.quantity * hours)
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

  const updateHours = (index, newHours) => {
    // Convert to number and handle invalid inputs
    let hours = parseFloat(newHours)

    // If input is empty, NaN, or invalid, set to 1
    if (isNaN(hours) || hours < 0) {
      hours = 1
    }
    // Cap at 24 hours
    if (hours > 24) {
      hours = 24
    }

    const updatedGadgets = selectedGadgets.map((gadget, i) =>
      i === index ? { ...gadget, hours: hours } : gadget
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
      setIsLoading(true)
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords

      // Updated query to be more specific about solar companies
      const query = 'solar+energy+company+OR+solar+panel+installer+OR+solar+system+provider'
      const [locationData, companiesData] = await Promise.all([
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`),
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=${longitude},${latitude}&access_token=${mapboxgl.accessToken}&limit=10&types=poi`)
      ])

      const locationJson = await locationData.json()
      const companiesJson = await companiesData.json()

      // Set location info
      const locationDetails = {
        city: locationJson.features.find(f => f.place_type.includes('place'))?.text,
        state: locationJson.features.find(f => f.place_type.includes('region'))?.text
      }
      setLocation(locationDetails)

      // Process nearby companies with more details
      const companies = companiesJson.features.map(feature => ({
        id: feature.id,
        name: feature.text,
        address: feature.place_name,
        coordinates: feature.center,
        distance: feature.properties.distance,
        type: feature.properties.category || 'Solar Company',
        phone: feature.properties.tel || 'Not available',
        website: feature.properties.website || '#',
        hours: feature.properties.hours || 'Hours not available',
        rating: feature.properties.rating || 'N/A'
      }))

      setNearbyCompanies(companies)

      // Initialize map
      if (mapContainer.current) {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [longitude, latitude],
          zoom: 12
        })

        // Add user location marker
        new mapboxgl.Marker({ color: '#FF0000' })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
          .addTo(map)

        // Add markers for companies with enhanced popups
        companies.forEach(company => {
          new mapboxgl.Marker({ color: '#006241' })
            .setLngLat(company.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="company-popup">
                    <h3>${company.name}</h3>
                    <p><strong>Address:</strong> ${company.address}</p>
                    <p><strong>Distance:</strong> ${formatDistance(company.distance)}</p>
                    <p><strong>Phone:</strong> ${company.phone}</p>
                    <p><strong>Hours:</strong> ${company.hours}</p>
                  </div>
                `)
            )
            .addTo(map)
        })
      }

    } catch (error) {
      console.error('Location detection failed:', error)
    } finally {
      setIsLoading(false)
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

  // Call detectLocation when step 6 is reached
  useEffect(() => {
    if (step === 6) {
      detectLocation()
    }
  }, [step])

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
                        Power: {gadget.powerRating} kW × {gadget.quantity} × {gadget.hours}h = {(gadget.powerRating * gadget.quantity * gadget.hours).toFixed(2)} kWh/day
                      </p>
                    </div>
                    <div className="onboarding-gadget-controls">
                      <div className="onboarding-quantity-control">
                        <button onClick={() => updateQuantity(index, gadget.quantity - 1)}>
                          <FaMinus />
                        </button>
                        <span>{gadget.quantity}</span>
                        <button onClick={() => updateQuantity(index, gadget.quantity + 1)}>
                          <FaPlus />
                        </button>
                      </div>
                      <div className="onboarding-hours-control">
                        <label>Hours/day:</label>
                        <input
                          type="number"
                          value={gadget.hours || 1}
                          onChange={(e) => updateHours(index, e.target.value)}
                          min="0"
                          max="24"
                          step="0.5"
                          className="hours-input"
                          onBlur={(e) => {
                            if (!e.target.value || isNaN(e.target.value)) {
                              updateHours(index, 1)
                            }
                          }}
                        />
                      </div>
                      <button
                        className="onboarding-remove-gadget"
                        onClick={() => removeGadget(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedGadgets.length > 0 && (
              <div className="onboarding-power-summary">
                <div className="onboarding-total-power">
                  <span>Total Power Required:</span>
                  <strong>{totalPower.toFixed(2)} kWh/day</strong>
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
            <h2>Solar Companies Near You</h2>
            {isLoading ? (
              <div className="loading-spinner">Finding solar companies near you...</div>
            ) : (
              <>
                {location && (
                  <p className="location-info">
                    Showing results for {location.city}, {location.state}
                  </p>
                )}
                <div className="map-container" ref={mapContainer} />
                <div className="solar-companies-list">
                  {nearbyCompanies.map((company) => (
                    <div
                      key={company.id}
                      className={`company-card ${selectedCompany?.id === company.id ? 'selected' : ''}`}
                      onClick={() => handleCompanySelection(company)}
                    >
                      <div className="company-header">
                        <h3>{company.name}</h3>
                        <span className="distance">{formatDistance(company.distance)}</span>
                      </div>
                      <div className="company-details">
                        <p className="company-address">
                          <strong>Address:</strong> {company.address}
                        </p>
                        <p className="company-phone">
                          <strong>Phone:</strong> {company.phone}
                        </p>
                        <p className="company-hours">
                          <strong>Hours:</strong> {company.hours}
                        </p>
                        {company.rating !== 'N/A' && (
                          <p className="company-rating">
                            <strong>Rating:</strong> {company.rating}
                          </p>
                        )}
                        {company.website !== '#' && (
                          <a href={company.website} target="_blank" rel="noopener noreferrer"
                            className="company-website">
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {selectedCompany && (
              <button className="onboarding-next-button" onClick={handleFinalSubmit}>
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