import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const currentPartner = JSON.parse(localStorage.getItem('currentPartner'))
  
  if (!currentPartner) {
    return <Navigate to="/partner/login" replace />
  }
  
  return children
}

export default ProtectedRoute 