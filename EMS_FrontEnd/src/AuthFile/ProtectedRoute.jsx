import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthCon } from './AuthContext'


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthCon)

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
