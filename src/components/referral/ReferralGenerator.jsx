import { useState } from 'react'

function ReferralGenerator() {
  const [referralLink, setReferralLink] = useState('')

  const generateLink = () => {
    const uniqueCode = Math.random().toString(36).substring(7)
    setReferralLink(`https://solarenergy.com/refer/${uniqueCode}`)
  }

  return (
    <div className="referral-generator">
      <h2>Generate Your Referral Link</h2>
      <div className="link-generator">
        <button onClick={generateLink} className="generate-btn">
          Generate New Link
        </button>
        {referralLink && (
          <div className="link-display">
            <input type="text" value={referralLink} readOnly />
            <button onClick={() => navigator.clipboard.writeText(referralLink)}>
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralGenerator 