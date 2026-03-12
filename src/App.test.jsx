import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('App routing', () => {
  beforeEach(() => {
    sessionStorage.clear()
    window.location.hash = '#/'
  })

  it('renders user page on root route', () => {
    render(<App />)

    expect(screen.getByText('使用者模式控制台')).toBeInTheDocument()
  })

  it('redirects unauthenticated admin route to login page', () => {
    window.location.hash = '#/admin'
    render(<App />)

    expect(screen.getByRole('button', { name: '登入管理者模式' })).toBeInTheDocument()
  })

  it('renders admin page when session exists', () => {
    sessionStorage.setItem('maho-admin-auth', JSON.stringify({ authenticated: true }))
    window.location.hash = '#/admin'
    render(<App />)

    expect(screen.getByText('管理者模式控制台')).toBeInTheDocument()
  })
})
