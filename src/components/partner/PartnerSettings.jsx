import { useState } from 'react'

function PartnerSettings() {
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankCode: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save bank details
  }

  return (
    <div className="partner-settings">
      <h1>Account Settings</h1>

      <div className="settings-section">
        <h2>Payment Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({
                ...bankDetails,
                bankName: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({
                ...bankDetails,
                accountNumber: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label>Account Name</label>
            <input
              type="text"
              value={bankDetails.accountName}
              onChange={(e) => setBankDetails({
                ...bankDetails,
                accountName: e.target.value
              })}
              required
            />
          </div>

          <button type="submit" className="save-button">
            Save Payment Details
          </button>
        </form>
      </div>
    </div>
  )
}

export default PartnerSettings 