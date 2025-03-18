import { useState, useEffect } from 'react'

function ReferralDashboard() {
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    commissionsEarned: 0,
    conversionRate: 0,
  })

  const [referralLink, setReferralLink] = useState('')

  useEffect(() => {
    // Generate unique referral link
    const uniqueCode = Math.random().toString(36).substring(7)
    setReferralLink(`https://solarenergy.com/refer/${uniqueCode}`)
  }, [])

  return (
    <div className="referral-dashboard">
      <h2>Your Referral Dashboard</h2>
      
      <div className="referral-stats">
        <div className="stat-card">
          <h3>Total Referrals</h3>
          <p>{referralStats.totalReferrals}</p>
        </div>
        <div className="stat-card">
          <h3>Active Referrals</h3>
          <p>{referralStats.activeReferrals}</p>
        </div>
        <div className="stat-card">
          <h3>Commissions Earned</h3>
          <p>${referralStats.commissionsEarned}</p>
        </div>
        <div className="stat-card">
          <h3>Conversion Rate</h3>
          <p>{referralStats.conversionRate}%</p>
        </div>
      </div>

      <div className="referral-link-section">
        <h3>Your Referral Link</h3>
        <div className="link-container">
          <input type="text" value={referralLink} readOnly />
          <button onClick={() => navigator.clipboard.writeText(referralLink)}>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReferralDashboard 