export function validateVerificationCode(code) {
  return typeof code === 'string' && code.trim().length > 0
}

export function validateMessageInput(message) {
  return typeof message === 'string' && message.trim().length > 0
}

export function canControlDevices(devices) {
  const connectedDevices = devices.filter((device) => device.connected)
  const selectedDevices = connectedDevices.filter((device) => device.selected)

  if (selectedDevices.length === 0) {
    return false
  }

  return connectedDevices.length > 0 && connectedDevices.every((device) => device.authenticated)
}
