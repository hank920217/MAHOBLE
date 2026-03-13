import { APP_MODES, AUTH_RESPONSES } from './constants.js'

export function formatClockTime(value) {
  if (!value) {
    return '尚無紀錄'
  }

  return new Date(value).toLocaleTimeString('zh-TW', {
    hour12: false,
  })
}

export function formatConnectionStatus(connected) {
  return connected ? '已連線' : '未連線'
}

export function formatAuthStatus(status, authenticated) {
  if (authenticated) {
    return '已驗證'
  }

  switch (status) {
    case AUTH_RESPONSES.PENDING:
      return '驗證中'
    case AUTH_RESPONSES.FAIL:
      return '驗證失敗'
    case AUTH_RESPONSES.REQUIRED:
      return '需重新驗證'
    case AUTH_RESPONSES.TIMEOUT:
      return '驗證逾時'
    case AUTH_RESPONSES.CANCELLED:
      return '已取消驗證'
    default:
      return '未驗證'
  }
}

export function formatRoleMode(role) {
  return role === APP_MODES.ADMIN ? '管理者模式' : '使用者模式'
}
