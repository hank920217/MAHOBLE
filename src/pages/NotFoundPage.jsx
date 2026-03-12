import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout.jsx'
import { APP_MODES } from '../utils/constants.js'

function NotFoundPage() {
  return (
    <PageLayout
      mode={APP_MODES.USER}
      subtitle="這個路由不存在，請返回首頁或管理者入口。"
      title="找不到頁面"
    >
      <div className="panel single-column not-found">
        <h2>404</h2>
        <p>你造訪的頁面不存在。</p>
        <div className="panel__footer">
          <Link className="button button--primary" to="/">
            返回首頁
          </Link>
          <Link className="button button--ghost" to="/admin-login">
            前往管理者登入
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}

export default NotFoundPage
