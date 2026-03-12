import { APP_MODES } from './constants.js'

export function validateVerificationCode(code) {
  return typeof code === 'string' && code.trim().length > 0
}

export function validateMessageInput(message) {
  return typeof message === 'string' && message.trim().length > 0
}

export function canControlDevices(devices, mode) {
  const connectedDevices = devices.filter((device) => device.connected)
  const selectedDevices = connectedDevices.filter((device) => device.selected)

  if (selectedDevices.length === 0) {
    return false
  }

  if (mode === APP_MODES.ADMIN) {
    return true
  }

  return connectedDevices.length > 0 && connectedDevices.every((device) => device.authenticated)
}
