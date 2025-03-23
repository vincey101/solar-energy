import { useState } from 'react'
import contactHero from '../../assets/images/contact-us.jpg'
import { FaUser, FaBuilding } from 'react-icons/fa'

function GetStarted() {
  const [registrationType, setRegistrationType] = useState('user')
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    phone: '',
    location: '',
    message: '',
    consent: false,

    // User specific fields
    propertyType: 'residential',

    // Partner specific fields
    companyName: '',
    businessType: 'installer',
    yearsInBusiness: '',
    licenseNumber: '',
    insuranceInfo: '',
    numberOfEmployees: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (registrationType === 'partner') {
      // Save partner data
      const partners = JSON.parse(localStorage.getItem('partners') || '[]')
      const newPartner = {
        id: Date.now(),
        email: formData.email,
        name: formData.name,
        companyName: formData.companyName,
        businessType: formData.businessType,
        // Add other relevant fields
        // In real app, you'd hash the password
        password: 'defaultPassword123' // You should add password field to form
      }

      partners.push(newPartner)
      localStorage.setItem('partners', JSON.stringify(partners))

      // Redirect to partner login
      window.location.href = '/partner/login'
    }
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="get-started">
      <div
        className="get-started-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${contactHero})`
        }}
      >
        <div className="get-started-header">
          <h1>Let's Get Started</h1>
          <p>Choose your registration type below</p>
        </div>
      </div>

      <div className="get-started-content">
        <div className="registration-type-selector">
          <button
            className={`type-button ${registrationType === 'user' ? 'active' : ''}`}
            onClick={() => setRegistrationType('user')}
          >
            <FaUser />
            <span>Home/Business Owner</span>
          </button>
          <button
            className={`type-button ${registrationType === 'partner' ? 'active' : ''}`}
            onClick={() => setRegistrationType('partner')}
          >
            <FaBuilding />
            <span>Solar Company Partner</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-grid">
            {/* Common Fields */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                required
              />
            </div>

            {/* User Specific Fields */}
            {registrationType === 'user' && (
              <div className="form-group">
                <label htmlFor="propertyType">Property Type</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
            )}

            {/* Partner Specific Fields */}
            {registrationType === 'partner' && (
              <>
                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="businessType">Business Type</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                  >
                    <option value="installer">Solar Installer</option>
                    <option value="manufacturer">Equipment Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="consultant">Solar Consultant</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="yearsInBusiness">Years in Business</label>
                  <input
                    type="number"
                    id="yearsInBusiness"
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="licenseNumber">License Number</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="insuranceInfo">Insurance Information</label>
                  <input
                    type="text"
                    id="insuranceInfo"
                    name="insuranceInfo"
                    value={formData.insuranceInfo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="numberOfEmployees">Number of Employees</label>
                  <input
                    type="number"
                    id="numberOfEmployees"
                    name="numberOfEmployees"
                    value={formData.numberOfEmployees}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group full-width">
              <label htmlFor="message">Additional Information</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder={registrationType === 'user' ?
                  "Tell us about your energy needs..." :
                  "Tell us about your company and services..."}
              />
            </div>

            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                />
                I agree to receive communications about solar energy solutions
              </label>
            </div>
          </div>

          <button type="submit" className="submit-button">
            {registrationType === 'user' ? 'Get Started' : 'Submit Partner Application'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default GetStarted 