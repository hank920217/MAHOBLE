import { describe, expect, it } from 'vitest'
import { APP_MODES, AUTH_RESPONSES } from './constants.js'
import { formatAuthStatus, formatConnectionStatus, formatRoleMode } from './formatters.js'
import { canControlDevices, validateMessageInput, validateVerificationCode } from './validators.js'

describe('formatters and validators', () => {
  it('formats connection and auth states', () => {
    expect(formatConnectionStatus(true)).toBe('已連線')
    expect(formatAuthStatus(AUTH_RESPONSES.PENDING, false)).toBe('驗證中')
    expect(formatRoleMode(APP_MODES.ADMIN)).toBe('管理者模式')
  })

  it('validates message and verification inputs', () => {
    expect(validateMessageInput(' Hello ')).toBe(true)
    expect(validateMessageInput('   ')).toBe(false)
    expect(validateVerificationCode('1234')).toBe(true)
    expect(validateVerificationCode('')).toBe(false)
  })

  it('allows admin mode and blocks unauthenticated user mode', () => {
    const devices = [
      { connected: true, authenticated: false, selected: true },
      { connected: true, authenticated: true, selected: true },
    ]

    expect(canControlDevices(devices, APP_MODES.USER)).toBe(false)
    expect(canControlDevices(devices, APP_MODES.ADMIN)).toBe(true)
  })
})
