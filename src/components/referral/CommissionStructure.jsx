function CommissionStructure() {
  return (
    <div className="commission-structure">
      <h2>Commission Structure</h2>
      <div className="commission-tiers">
        <div className="tier">
          <h3>Basic Tier</h3>
          <p>5% of system cost</p>
          <ul>
            <li>1-3 successful referrals</li>
            <li>Up to $1,000 per referral</li>
          </ul>
        </div>
        <div className="tier">
          <h3>Premium Tier</h3>
          <p>7.5% of system cost</p>
          <ul>
            <li>4-10 successful referrals</li>
            <li>Up to $1,500 per referral</li>
          </ul>
        </div>
        <div className="tier">
          <h3>Elite Tier</h3>
          <p>10% of system cost</p>
          <ul>
            <li>11+ successful referrals</li>
            <li>Up to $2,000 per referral</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CommissionStructure 