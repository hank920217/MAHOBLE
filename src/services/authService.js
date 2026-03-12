import {
  ADMIN_SESSION_KEY,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_USERNAME,
} from '../utils/constants.js'
import { getSessionValue, removeSessionValue, setSessionValue } from '../utils/storage.js'

export function loginAdmin(username, password) {
  const success =
    username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD

  if (success) {
    setSessionValue(ADMIN_SESSION_KEY, { authenticated: true })
    return { success: true, message: '登入成功' }
  }

  return { success: false, message: '帳號或密碼錯誤' }
}

export function logoutAdmin() {
  removeSessionValue(ADMIN_SESSION_KEY)
}

export function isAdminAuthenticated() {
  return Boolean(getSessionValue(ADMIN_SESSION_KEY)?.authenticated)
}
