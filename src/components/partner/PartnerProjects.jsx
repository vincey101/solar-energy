import { useState } from 'react'

function PartnerProjects() {
  const [projects, setProjects] = useState([])
  
  return (
    <div className="partner-projects">
      <h1>Project Tracking</h1>
      
      <div className="projects-list">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`status ${project.status}`}>{project.status}</span>
            </div>
            
            <div className="project-details">
              <div className="detail-row">
                <span>Total Cost:</span>
                <strong>₦{project.totalCost.toLocaleString()}</strong>
              </div>
              <div className="detail-row">
                <span>Payment Type:</span>
                <strong>{project.paymentType}</strong>
              </div>
              <div className="detail-row">
                <span>Amount Paid:</span>
                <strong>₦{project.amountPaid.toLocaleString()}</strong>
              </div>
              <div className="detail-row">
                <span>Balance:</span>
                <strong>₦{project.balance.toLocaleString()}</strong>
              </div>
            </div>

            {project.paymentType === 'Installmental' && (
              <div className="installment-details">
                <h4>Payment Schedule</h4>
                {project.installments.map(installment => (
                  <div key={installment.id} className="installment-row">
                    <span>{installment.dueDate}</span>
                    <span>₦{installment.amount.toLocaleString()}</span>
                    <span className={`status ${installment.status}`}>
                      {installment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnerProjects 