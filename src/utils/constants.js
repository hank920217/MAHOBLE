export const APP_MODES = {
  USER: 'user',
  ADMIN: 'admin',
}

export const BLUETOOTH_NAME_PREFIX = 'maho'
export const SERVICE_UUID = '000000ff-0000-1000-8000-00805f9b34fb'
export const CHARACTERISTIC_UUID = '0000ff01-0000-1000-8000-00805f9b34fb'
export const AUTH_TIMEOUT_MS = 5000
export const MAX_LOG_ENTRIES = 100
export const ADMIN_SESSION_KEY = 'maho-admin-auth'
export const DEFAULT_ADMIN_USERNAME = 'admin'
export const DEFAULT_ADMIN_PASSWORD = '1234'
export const APP_CACHE_NAME = 'maho-bluetooth-cache-v1'

export const AUTH_RESPONSES = {
  OK_USER: 'AUTH_OK_USER',
  OK_ADMIN: 'AUTH_OK_ADMIN',
  FAIL: 'AUTH_FAIL',
  REQUIRED: 'AUTH_REQUIRED',
  PENDING: 'PENDING',
  TIMEOUT: 'TIMEOUT',
  CANCELLED: 'CANCELLED',
}

export const AUTH_ROLE_LABELS = {
  [APP_MODES.USER]: 'USER',
  [APP_MODES.ADMIN]: 'ADMIN',
}

export const COMMAND_LEVELS = [1, 2, 3]
