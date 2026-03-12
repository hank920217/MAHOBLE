import { useBluetoothContext } from '../context/BluetoothContext.jsx'
import { createCommandMessage, createTextMessage } from '../services/messageService.js'
import { canControlDevices, validateMessageInput } from '../utils/validators.js'

function useBluetooth() {
  const context = useBluetoothContext()
  const connectedDevices = context.devices.filter((device) => device.connected)
  const selectedDevices = connectedDevices.filter((device) => device.selected)
  const controlEnabled = canControlDevices(context.devices, context.mode)

  async function sendTextMessage(message) {
    if (!validateMessageInput(message)) {
      throw new Error('請輸入要發送的訊息')
    }

    return context.broadcastPayload(createTextMessage(message))
  }

  async function sendQuickCommand(level) {
    return context.broadcastPayload(createCommandMessage(level))
  }

  return {
    ...context,
    connectedDevices,
    selectedDevices,
    controlEnabled,
    sendTextMessage,
    sendQuickCommand,
  }
}

export default useBluetooth
