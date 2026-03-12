import { createContext, useContext, useState } from 'react'
import {
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
} from '../services/authService.js'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated())

  function signIn(username, password) {
    const result = loginAdmin(username, password)
    setIsAuthenticated(result.success)
    return result
  }

  function signOut() {
    logoutAdmin()
    setIsAuthenticated(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuthContext() {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider')
  }

  return context
}
