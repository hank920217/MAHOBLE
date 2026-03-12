import { Navigate } from 'react-router-dom'
import useAdminAuth from '../../hooks/useAdminAuth.js'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return <Navigate replace to="/admin-login" />
  }

  return children
}

export default ProtectedRoute
