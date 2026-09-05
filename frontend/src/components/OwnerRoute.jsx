import { Navigate } from 'react-router-dom'

function OwnerRoute({ children }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'RESTAURANT_OWNER') {
    return <Navigate to="/" replace />
  }

  return children
}

export default OwnerRoute