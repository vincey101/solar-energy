import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaPhone, FaExchangeAlt, FaBuilding } from 'react-icons/fa'
import slider3 from '../../assets/images/slider3.jpg'
import '../../styles/referral.css'

function Referral() {
  const [isCustomer, setIsCustomer] = useState(true)
  const [credentials, setCredentials] = useState({
    email: '',
    phoneNumber: '',
    companyName: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const navbar = document.querySelector('.navbar')
    navbar.style.backgroundColor = '#000'

    return () => {
      navbar.style.backgroundColor = ''
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{10,}$/

    if (!emailRegex.test(credentials.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!phoneRegex.test(credentials.phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (minimum 10 digits)')
      return
    }

    if (!isCustomer && !credentials.companyName.trim()) {
      setError('Please enter a company name')
      return
    }

    // If validation passes, create a temporary user object
    const tempUser = {
      id: Date.now(), // Generate a temporary ID
      email: credentials.email,
      phoneNumber: credentials.phoneNumber,
      ...(isCustomer ? {} : { companyName: credentials.companyName })
    }

    // Store the temporary user
    localStorage.setItem(
      isCustomer ? 'currentCustomer' : 'currentPartner',
      JSON.stringify(tempUser)
    )

    // Navigate to generate referral link
    navigate('/referral/generate')
  }

  const toggleUserType = () => {
    setIsCustomer(!isCustomer)
    setError('')
    setCredentials({
      email: '',
      phoneNumber: '',
      companyName: ''
    })
  }

  return (
    <div className="referral-login">
      <div className="referral-hero" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slider3})`
      }}>
        <h1>Referral Program</h1>
        <p>Generate your unique referral link and earn rewards</p>
      </div>

      <div className="login-container">
        <div className="user-type-toggle">
          <button
            className={isCustomer ? 'active' : ''}
            onClick={() => setIsCustomer(true)}
          >
            Customer Login
          </button>
          <button
            className={!isCustomer ? 'active' : ''}
            onClick={() => setIsCustomer(false)}
          >
            Partner Login
          </button>
        </div>

        <div className="login-card">
          <div className="login-header">
            <h2>{isCustomer ? 'Customer Sign In' : 'Partner Sign In'}</h2>
            <p>Welcome back! Please login to generate your referral link</p>
          </div>

          {error && (
            <div className="error-message">
              <FaLock />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={credentials.email}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    email: e.target.value
                  })}
                  required
                />
              </div>
            </div>
            {!isCustomer && (
              <div className="form-group">
                <div className="input-group">
                  <FaBuilding className="input-icon" />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={credentials.companyName}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      companyName: e.target.value
                    })}
                    required
                  />
                </div>
              </div>
            )}



            <div className="form-group">
              <div className="input-group">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={credentials.phoneNumber}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    phoneNumber: e.target.value
                  })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <button className="switch-type-btn" onClick={toggleUserType}>
              <FaExchangeAlt />
              Switch to {isCustomer ? 'Partner' : 'Customer'} Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referral 