import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLoginForm from '../components/auth/AdminLoginForm.jsx'
import PageLayout from '../components/layout/PageLayout.jsx'
import useAdminAuth from '../hooks/useAdminAuth.js'
import { APP_MODES } from '../utils/constants.js'

function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const { signIn } = useAdminAuth()
  const navigate = useNavigate()

  function handleSubmit(credentials) {
    const result = signIn(credentials.username, credentials.password)

    if (!result.success) {
      setErrorMessage(result.message)
      return
    }

    navigate('/admin')
  }

  return (
    <PageLayout
      mode={APP_MODES.ADMIN}
      subtitle="登入後可進入受保護的管理者模式，已連線裝置不需再次驗證即可操作。"
      title="管理者登入"
    >
      <div className="single-column">
        <AdminLoginForm errorMessage={errorMessage} onSubmit={handleSubmit} />
      </div>
    </PageLayout>
  )
}

export default AdminLoginPage
