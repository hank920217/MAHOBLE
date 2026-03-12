import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAdminAuth from '../../hooks/useAdminAuth.js'
import { APP_MODES } from '../../utils/constants.js'

function Header({ mode, title, subtitle }) {
  const { isAuthenticated, signOut } = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminRoute = location.pathname === '/admin'

  function handleLogout() {
    signOut()
    navigate('/admin-login')
  }

  return (
    <header className={`topbar topbar--${mode}`}>
      <div>
        <p className="eyebrow">{mode === APP_MODES.ADMIN ? 'Administrator' : 'User Control'}</p>
        <h1>{title}</h1>
        <p className="topbar__subtitle">{subtitle}</p>
      </div>

      <div className="topbar__actions">
        {!isAdminRoute && (
          <Link className="button button--ghost button--mobile-tight" to="/admin-login">
            管理者登入
          </Link>
        )}

        {isAdminRoute && (
          <Link className="button button--ghost button--mobile-tight" to="/">
            返回使用者模式
          </Link>
        )}

        {isAuthenticated && isAdminRoute && (
          <button className="button button--danger button--mobile-tight" onClick={handleLogout} type="button">
            登出
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
