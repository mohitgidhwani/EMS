import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthCon } from './AuthContext'

// For /register and /login — once a user is authenticated, sends
// them straight to the dashboard instead of showing the auth forms.
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthCon)

  if (loading) return null

  if (user) return <Navigate to="/" replace />

  return children
}

export default PublicRoute
