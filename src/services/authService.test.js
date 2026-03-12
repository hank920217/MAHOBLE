import { beforeEach, describe, expect, it } from 'vitest'
import { isAdminAuthenticated, loginAdmin, logoutAdmin } from './authService.js'

describe('authService', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('stores login state for valid credentials', () => {
    const result = loginAdmin('admin', '1234')

    expect(result.success).toBe(true)
    expect(isAdminAuthenticated()).toBe(true)
  })

  it('rejects invalid credentials', () => {
    const result = loginAdmin('admin', 'wrong')

    expect(result.success).toBe(false)
    expect(isAdminAuthenticated()).toBe(false)
  })

  it('clears session on logout', () => {
    loginAdmin('admin', '1234')
    logoutAdmin()

    expect(isAdminAuthenticated()).toBe(false)
  })
})
