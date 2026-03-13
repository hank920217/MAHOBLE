import { APP_MODES, AUTH_ROLE_LABELS } from '../utils/constants.js'

export function createAuthMessage(role, code) {
  const normalizedRole = AUTH_ROLE_LABELS[role] ?? AUTH_ROLE_LABELS[APP_MODES.USER]
  return `AUTH:${normalizedRole}:${code.trim()}`
}

export function createTextMessage(message) {
  return `MSG:${message.trim()}`
}

export function createCommandMessage(level) {
  return `${level}`
}

export function normalizeIncomingMessage(message) {
  return `${message ?? ''}`.trim()
}

export async function sendPayloadToDevices(devices, payload, writer) {
  const perDeviceResults = await Promise.all(
    devices.map(async (deviceRecord) => {
      try {
        await writer(deviceRecord, payload)
        return { deviceId: deviceRecord.id, deviceName: deviceRecord.name, ok: true }
      } catch (error) {
        return {
          deviceId: deviceRecord.id,
          deviceName: deviceRecord.name,
          ok: false,
          error: error instanceof Error ? error.message : '寫入失敗',
        }
      }
    }),
  )

  const successCount = perDeviceResults.filter((result) => result.ok).length
  const failureCount = perDeviceResults.length - successCount

  return { successCount, failureCount, perDeviceResults }
}
