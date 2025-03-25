import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { parsePhoneNumber, AsYouType, getExampleNumber } from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

// Complete list of African countries
const africanCountries = [
  { code: 'DZ', name: 'Algeria', dialCode: '+213' },
  { code: 'AO', name: 'Angola', dialCode: '+244' },
  { code: 'BJ', name: 'Benin', dialCode: '+229' },
  { code: 'BW', name: 'Botswana', dialCode: '+267' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226' },
  { code: 'BI', name: 'Burundi', dialCode: '+257' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236' },
  { code: 'TD', name: 'Chad', dialCode: '+235' },
  { code: 'KM', name: 'Comoros', dialCode: '+269' },
  { code: 'CG', name: 'Congo', dialCode: '+242' },
  { code: 'CD', name: 'DR Congo', dialCode: '+243' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253' },
  { code: 'EG', name: 'Egypt', dialCode: '+20' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251' },
  { code: 'GA', name: 'Gabon', dialCode: '+241' },
  { code: 'GM', name: 'Gambia', dialCode: '+220' },
  { code: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'GN', name: 'Guinea', dialCode: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245' },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225' },
  { code: 'KE', name: 'Kenya', dialCode: '+254' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266' },
  { code: 'LR', name: 'Liberia', dialCode: '+231' },
  { code: 'LY', name: 'Libya', dialCode: '+218' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261' },
  { code: 'MW', name: 'Malawi', dialCode: '+265' },
  { code: 'ML', name: 'Mali', dialCode: '+223' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230' },
  { code: 'MA', name: 'Morocco', dialCode: '+212' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258' },
  { code: 'NA', name: 'Namibia', dialCode: '+264' },
  { code: 'NE', name: 'Niger', dialCode: '+227' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250' },
  { code: 'ST', name: 'Sao Tome and Principe', dialCode: '+239' },
  { code: 'SN', name: 'Senegal', dialCode: '+221' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232' },
  { code: 'SO', name: 'Somalia', dialCode: '+252' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211' },
  { code: 'SD', name: 'Sudan', dialCode: '+249' },
  { code: 'SZ', name: 'Swaziland', dialCode: '+268' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255' },
  { code: 'TG', name: 'Togo', dialCode: '+228' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216' },
  { code: 'UG', name: 'Uganda', dialCode: '+256' },
  { code: 'EH', name: 'Western Sahara', dialCode: '+212' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263' },
].sort((a, b) => a.name.localeCompare(b.name))

// Add total steps constant
const TOTAL_STEPS = {
  user: 6,
  partner: 7  // Updated to reflect all 7 partner questions
}

function GetStarted() {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const [step, setStep] = useState(1)
  const [highestStepReached, setHighestStepReached] = useState(1)
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    email: '',
    phone: '',
    address: '',

    // User specific fields
    propertyType: '', // residential/commercial
    ownership: '', // own/rent
    roofType: '',

    // Partner specific fields
    companyName: '',
    businessType: '', // manufacturer/distributor/installer
    yearsInBusiness: '',
    licenses: '',
    servicesOffered: [],
    coverageArea: ''
  })
  const navigate = useNavigate()
  const [selectedCountry, setSelectedCountry] = useState(africanCountries[0])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [emailError, setEmailError] = useState('')

  // Get example number for selected country
  const getPlaceholder = (countryCode) => {
    const example = getExampleNumber(countryCode, examples)
    return example ? example.formatNational() : ''
  }

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  // Validate phone number
  const validatePhone = (number, country) => {
    try {
      const phoneNumber = parsePhoneNumber(number, country.code)
      if (phoneNumber && phoneNumber.isValid()) {
        setPhoneError('')
        return true
      }
      throw new Error()
    } catch {
      setPhoneError('Please enter a valid phone number')
      return false
    }
  }

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    const asYouType = new AsYouType(selectedCountry.code)
    const formattedNumber = asYouType.input(e.target.value)
    setPhoneNumber(formattedNumber)
    setFormData({ ...formData, phone: formattedNumber })
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      const nextStep = step + 1
      setStep(nextStep)
      setHighestStepReached(Math.max(highestStepReached, nextStep))
    }
  }

  const handleForward = () => {
    if (step < highestStepReached) {
      setStep(step + 1)
    }
  }

  const validateCurrentStep = () => {
    if (type === 'user') {
      switch (step) {
        case 1: // Name validation
          if (!formData.fullName.trim()) return false
          return true
        case 2: // Email validation
          if (!validateEmail(formData.email)) return false
          return true
        case 3: // Phone validation
          if (!phoneNumber || phoneNumber.length < 10) {
            setPhoneError('Please enter a valid phone number')
            return false
          }
          return true
        case 4: // Address validation
          if (!formData.address.trim()) return false
          return true
        default:
          return true
      }
    } else { // Partner flow validation
      switch (step) {
        case 1: // Company name
          if (!formData.companyName.trim()) return false
          return true
        case 2: // Business email
          if (!validateEmail(formData.email)) return false
          return true
        case 3: // Phone validation
          if (!phoneNumber || phoneNumber.length < 10) {
            setPhoneError('Please enter a valid phone number')
            return false
          }
          return true
        case 4: // Business type
          if (!formData.businessType.trim()) return false
          return true
        case 5: // Years in business
          if (!formData.yearsInBusiness) return false
          return true
        case 6: // Employees
          if (!formData.employees) return false
          return true
        case 7: // License number
          if (!formData.licenseNumber.trim()) return false
          return true
        default:
          return true
      }
    }
  }

  const handleSubmit = () => {
    if (!validateCurrentStep()) return // Add validation check before submission

    if (type === 'user') {
      // User flow submission
      const customers = JSON.parse(localStorage.getItem('customers') || '[]')

      if (customers.some(customer => customer.email === formData.email)) {
        setEmailError('This email is already registered')
        return
      }

      const newCustomer = {
        id: Date.now(),
        ...formData,
        registrationDate: new Date().toISOString()
      }

      customers.push(newCustomer)
      localStorage.setItem('customers', JSON.stringify(customers))
      localStorage.setItem('currentCustomer', JSON.stringify(newCustomer))
      navigate('/customer/dashboard')
    } else {
      // Partner flow submission
      const partners = JSON.parse(localStorage.getItem('partners') || '[]')

      if (partners.some(partner => partner.email === formData.email)) {
        setEmailError('This email is already registered')
        return
      }

      const newPartner = {
        id: Date.now(),
        ...formData,
        registrationDate: new Date().toISOString()
      }

      partners.push(newPartner)
      localStorage.setItem('partners', JSON.stringify(partners))
      localStorage.setItem('currentPartner', JSON.stringify(newPartner))
      navigate('/partner/dashboard')
    }
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSteps = TOTAL_STEPS[type] || 1
    const progress = Math.min((step / totalSteps) * 100, 100) // Cap at 100%
    return Math.round(progress)
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
          {step < highestStepReached && (
            <button className="nav-arrow down" onClick={handleForward}>
              <FaChevronDown />
            </button>
          )}
        </div>

        {type === 'user' ? (
          // Home/Business Owner Flow
          <>
            {step === 1 && (
              <div className="onboarding-step">
                <h2>What's your full name?</h2>
                <div className="onboarding-input-wrapper">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="onboarding-input"
                  />
                </div>
                {formData.fullName.trim() && (
                  <button className="onboarding-next-button" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="onboarding-step">
                <h2>What's your email address?</h2>
                <div className="onboarding-input-wrapper">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      validateEmail(e.target.value)
                    }}
                    onBlur={() => validateEmail(formData.email)}
                    placeholder="example@email.com"
                    className="onboarding-input"
                  />
                  {emailError && <div className="input-error">{emailError}</div>}
                </div>
                {formData.email && !emailError && (
                  <button className="onboarding-next-button" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            )}

            {step === 3 && (
              <PhoneStep
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                handleNext={handleNext}
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {step === 4 && (
              <div className="onboarding-step">
                <h2>What's your installation address?</h2>
                <div className="onboarding-input-wrapper">
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your complete address"
                    className="onboarding-input address-input"
                    rows={3}
                  />
                </div>
                {formData.address.trim() && (
                  <button className="onboarding-next-button" onClick={handleSubmit}>
                    Complete Onboarding
                  </button>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="onboarding-step">
                <h2>What type of property do you have?</h2>
                <div className="onboarding-buttons">
                  <button
                    className={formData.propertyType === 'residential' ? 'selected' : ''}
                    onClick={() => {
                      setFormData({ ...formData, propertyType: 'residential' })
                      handleNext()
                    }}
                  >
                    Residential Property
                  </button>
                  <button
                    className={formData.propertyType === 'commercial' ? 'selected' : ''}
                    onClick={() => {
                      setFormData({ ...formData, propertyType: 'commercial' })
                      handleNext()
                    }}
                  >
                    Commercial Property
                  </button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="onboarding-step">
                <h2>Do you own or rent this property?</h2>
                <div className="onboarding-buttons">
                  <button
                    className={formData.ownership === 'own' ? 'selected' : ''}
                    onClick={() => {
                      setFormData({ ...formData, ownership: 'own' })
                      handleNext()
                    }}
                  >
                    I Own It
                  </button>
                  <button
                    className={formData.ownership === 'rent' ? 'selected' : ''}
                    onClick={() => {
                      setFormData({ ...formData, ownership: 'rent' })
                      handleNext()
                    }}
                  >
                    I Rent It
                  </button>
                </div>
              </div>
            )}

            {/* Add more steps for user flow */}
          </>
        ) : (
          // Solar Company Partner Flow
          <>
            {step === 1 && (
              <div className="onboarding-step">
                <h2>What's your company name?</h2>
                <div className="onboarding-input-wrapper">
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Type your answer here"
                    className="onboarding-input"
                  />
                </div>
                {formData.companyName && (
                  <button className="onboarding-next-button" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="onboarding-step">
                <h2>What's your business email?</h2>
                <div className="onboarding-input-wrapper">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      validateEmail(e.target.value)
                    }}
                    placeholder="example@company.com"
                    className="onboarding-input"
                  />
                  {emailError && <div className="input-error">{emailError}</div>}
                </div>
                {formData.email && !emailError && (
                  <button className="onboarding-next-button" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            )}

            {step === 3 && (
              <PhoneStep phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} handleNext={handleNext} formData={formData} setFormData={setFormData} />
            )}

            {step === 4 && (
              <div className="onboarding-step">
                <h2>What type of solar business are you?</h2>
                <div className="onboarding-input-wrapper">
                  <input
                    type="text"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    placeholder="e.g. Manufacturer, Distributor, Installer"
                    className="onboarding-input"
                  />
                </div>
                {formData.businessType && (
                  <button className="onboarding-next-button" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="onboarding-step">
                <h2>How many years have you been in business?</h2>
                <div className="onboarding-input-wrapper">
                  <input
                    type="number"
                    value={formData.yearsInBusiness}
                    onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                    placeholder="Type your answer here"
                    className="onboarding-input"
                  />
                </div>
                {formData.yearsInBusiness && (
                  <button className="onboarding-next-button" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="onboarding-step">
                <h2>How many employees do you have?</h2>
                <div className="onboarding-input-wrapper">
                  <input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                    placeholder="Type your answer here"
                    className="onboarding-input"
                  />
                </div>
                {formData.employees && (
                  <button className="onboarding-next-button" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            )}

            {step === 7 && (
              <div className="onboarding-step">
                <h2>What's your license number?</h2>
                <div className="onboarding-input-wrapper">
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="Type your license number"
                    className="onboarding-input"
                  />
                </div>
                {formData.licenseNumber && (
                  <button className="onboarding-next-button" onClick={handleSubmit}>
                    Complete Onboarding
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div className="progress-indicator">
          <div className="progress-text">
            {calculateProgress()}% completed
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${calculateProgress()}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Update the phone number step component
const PhoneStep = ({ phoneNumber, setPhoneNumber, handleNext, formData, setFormData }) => (
  <div className="onboarding-step">
    <h2>What's your WhatsApp phone number?</h2>
    <div className="onboarding-input-wrapper">
      <PhoneInput
        country={'ng'}
        value={phoneNumber}
        onChange={(value, country) => {
          setPhoneNumber(value)
          setFormData({ ...formData, phone: value })
        }}
        onlyCountries={africanCountries.map(country => country.code.toLowerCase())}
        inputClass="phone-input"
        buttonClass="country-select-button"
        dropdownClass="country-dropdown"
        searchClass="country-search"
        placeholder="Enter your phone number"
      />
    </div>
    {phoneNumber && phoneNumber.length >= 10 && (
      <button className="onboarding-next-button" onClick={handleNext}>
        Next
      </button>
    )}
  </div>
)

export default GetStarted 