import { HashRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'
import AdminLoginPage from '../pages/AdminLoginPage.jsx'
import AdminPage from '../pages/AdminPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import UserPage from '../pages/UserPage.jsx'

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  )
}

export default AppRouter
