import { useState } from 'react'

function AdminLoginForm({ errorMessage, onSubmit }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('1234')

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({ username, password })
  }

  return (
    <form className="panel login-panel" onSubmit={handleSubmit}>
      <div className="panel__header">
        <div>
          <p className="eyebrow">Admin Access</p>
          <h2>管理者登入</h2>
        </div>
      </div>

      <label className="field">
        <span>帳號</span>
        <input onChange={(event) => setUsername(event.target.value)} value={username} />
      </label>

      <label className="field">
        <span>密碼</span>
        <input
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </label>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <button className="button button--primary button--mobile-tight" type="submit">
        登入管理者模式
      </button>
    </form>
  )
}

export default AdminLoginForm
