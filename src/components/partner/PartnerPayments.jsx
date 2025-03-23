import { useState } from 'react'
import { FaFileInvoiceDollar } from 'react-icons/fa'

function PartnerPayments() {
  const [payments, setPayments] = useState([])
  const [filter, setFilter] = useState('all') // all, pending, completed

  return (
    <div className="partner-payments">
      <h1>Payment History</h1>

      <div className="payment-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="payments-list">
        {payments.map(payment => (
          <div key={payment.id} className="payment-card">
            <div className="payment-icon">
              <FaFileInvoiceDollar />
            </div>
            <div className="payment-info">
              <div className="payment-header">
                <h3>{payment.projectName}</h3>
                <span className={`payment-status ${payment.status}`}>
                  {payment.status}
                </span>
              </div>
              <div className="payment-details">
                <div className="detail-row">
                  <span>Amount:</span>
                  <strong>₦{payment.amount.toLocaleString()}</strong>
                </div>
                <div className="detail-row">
                  <span>Due Date:</span>
                  <strong>{payment.dueDate}</strong>
                </div>
                <div className="detail-row">
                  <span>Payment Type:</span>
                  <strong>{payment.type}</strong>
                </div>
              </div>
              {payment.status === 'pending' && (
                <button className="remind-btn">
                  Send Reminder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnerPayments 