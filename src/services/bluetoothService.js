import {
  BLUETOOTH_NAME_PREFIX,
  CHARACTERISTIC_UUID,
  SERVICE_UUID,
} from '../utils/constants.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export function isWebBluetoothSupported() {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator
}

export async function requestBluetoothDevice() {
  return navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: BLUETOOTH_NAME_PREFIX }],
    optionalServices: [SERVICE_UUID],
  })
}

export async function connectToDevice(device, handlers = {}) {
  const server = await device.gatt.connect()
  const service = await server.getPrimaryService(SERVICE_UUID)
  const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID)

  const handleNotification = (event) => {
    const message = decoder.decode(event.target.value).trim()
    handlers.onNotification?.({
      deviceId: device.id,
      deviceName: device.name || '未知裝置',
      message,
    })
  }

  const handleDisconnect = () => {
    handlers.onDisconnected?.({
      deviceId: device.id,
      deviceName: device.name || '未知裝置',
    })
  }

  device.addEventListener('gattserverdisconnected', handleDisconnect)

  if (characteristic.startNotifications) {
    await characteristic.startNotifications()
    characteristic.addEventListener('characteristicvaluechanged', handleNotification)
  }

  return {
    id: device.id,
    name: device.name || '未知裝置',
    device,
    server,
    characteristic,
    cleanup() {
      device.removeEventListener('gattserverdisconnected', handleDisconnect)
      characteristic.removeEventListener?.('characteristicvaluechanged', handleNotification)
    },
  }
}

export async function writeCharacteristic(characteristic, payload) {
  const data = encoder.encode(payload)

  if (characteristic.properties?.write && characteristic.writeValueWithResponse) {
    return characteristic.writeValueWithResponse(data)
  }

  if (
    characteristic.properties?.writeWithoutResponse &&
    characteristic.writeValueWithoutResponse
  ) {
    return characteristic.writeValueWithoutResponse(data)
  }

  if (characteristic.writeValueWithResponse) {
    return characteristic.writeValueWithResponse(data)
  }

  return characteristic.writeValue(data)
}

export function disconnectDevice(deviceRecord) {
  deviceRecord.cleanup?.()

  if (deviceRecord.device?.gatt?.connected) {
    deviceRecord.device.gatt.disconnect()
  }
}

export function disconnectAllDevices(deviceRecords) {
  deviceRecords.forEach((deviceRecord) => {
    disconnectDevice(deviceRecord)
  })
}
