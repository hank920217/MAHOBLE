import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  connectToDevice,
  disconnectAllDevices,
  disconnectDevice,
  isWebBluetoothSupported,
  requestBluetoothDevice,
  writeCharacteristic,
} from '../services/bluetoothService.js'
import { sendPayloadToDevices } from '../services/messageService.js'
import { APP_MODES, AUTH_RESPONSES } from '../utils/constants.js'
import { useLogContext } from './LogContext.jsx'

const BluetoothContext = createContext(null)

export function BluetoothProvider({ children }) {
  const { addLog } = useLogContext()
  const [mode, setModeState] = useState(APP_MODES.USER)
  const [devices, setDevices] = useState([])
  const [statusMessage, setStatusMessage] = useState('尚未連線任何裝置')
  const [lastBatchResult, setLastBatchResult] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const devicesRef = useRef([])
  const notificationListenersRef = useRef(new Set())
  const manualDisconnectIdsRef = useRef(new Set())
  const isSupported = isWebBluetoothSupported()

  useEffect(() => {
    devicesRef.current = devices
  }, [devices])

  function setMode(nextMode) {
    setModeState(nextMode)
  }

  function updateDevice(deviceId, partialState) {
    setDevices((currentDevices) =>
      currentDevices.map((device) =>
        device.id === deviceId ? { ...device, ...partialState } : device,
      ),
    )
  }

  function removeDevice(deviceId) {
    setDevices((currentDevices) =>
      currentDevices.filter((device) => device.id !== deviceId),
    )
  }

  function handleNotification(payload) {
    updateDevice(payload.deviceId, {
      lastResponseTime: new Date().toISOString(),
      lastAuthStatus: payload.message || AUTH_RESPONSES.REQUIRED,
    })
    setStatusMessage(`${payload.deviceName} 回應：${payload.message}`)

    notificationListenersRef.current.forEach((listener) => {
      listener(payload)
    })

    if (!payload.message.startsWith('AUTH_')) {
      addLog(`收到回應 ${payload.message}`, payload.deviceName)
    }
  }

  function handleDisconnected(payload) {
    const disconnectedDevice = devicesRef.current.find((device) => device.id === payload.deviceId)
    if (!disconnectedDevice) {
      return
    }

    disconnectedDevice.cleanup?.()
    removeDevice(payload.deviceId)
    setStatusMessage(`${payload.deviceName} 已中斷連線`)

    if (!manualDisconnectIdsRef.current.has(payload.deviceId)) {
      addLog('裝置中斷連線', payload.deviceName)
      return
    }

    manualDisconnectIdsRef.current.delete(payload.deviceId)
  }

  async function connectDevice(targetMode = mode) {
    if (!isSupported) {
      throw new Error('目前瀏覽器不支援 Web Bluetooth')
    }

    setIsConnecting(true)
    setLastBatchResult(null)

    try {
      const rawDevice = await requestBluetoothDevice()
      const connection = await connectToDevice(rawDevice, {
        onDisconnected: handleDisconnected,
        onNotification: handleNotification,
      })

      const nextDevice = {
        ...connection,
        connected: true,
        authenticated: false,
        role: targetMode,
        selected: true,
        lastResponseTime: new Date().toISOString(),
        lastAuthStatus: AUTH_RESPONSES.REQUIRED,
      }

      setDevices((currentDevices) => {
        const existingIndex = currentDevices.findIndex((device) => device.id === nextDevice.id)
        if (existingIndex === -1) {
          return [...currentDevices, nextDevice]
        }

        return currentDevices.map((device) =>
          device.id === nextDevice.id ? { ...device, ...nextDevice } : device,
        )
      })

      addLog('連線成功', nextDevice.name)
      setStatusMessage(`${nextDevice.name} 已連線`)
      return nextDevice
    } finally {
      setIsConnecting(false)
    }
  }

  async function writeToDevice(deviceId, payload) {
    const deviceRecord = devicesRef.current.find((device) => device.id === deviceId)

    if (!deviceRecord?.characteristic) {
      throw new Error('找不到裝置特徵值')
    }

    await writeCharacteristic(deviceRecord.characteristic, payload)
    updateDevice(deviceId, { lastResponseTime: new Date().toISOString() })
  }

  async function broadcastPayload(payload, selectedDeviceIds) {
    const targetDevices = devicesRef.current.filter(
      (device) =>
        device.connected &&
        device.selected &&
        (!selectedDeviceIds || selectedDeviceIds.includes(device.id)),
    )

    const result = await sendPayloadToDevices(targetDevices, payload, (deviceRecord, nextPayload) =>
      writeCharacteristic(deviceRecord.characteristic, nextPayload),
    )

    setLastBatchResult(result)
    setStatusMessage(`發送完成，成功 ${result.successCount} 台，失敗 ${result.failureCount} 台`)
    addLog(`發送 ${payload}`, `${result.successCount} 成功 / ${result.failureCount} 失敗`)

    result.perDeviceResults
      .filter((entry) => !entry.ok)
      .forEach((entry) => {
        addLog(`寫入失敗：${entry.error}`, entry.deviceName)
      })

    return result
  }

  function toggleDeviceSelection(deviceId) {
    setDevices((currentDevices) =>
      currentDevices.map((device) =>
        device.id === deviceId ? { ...device, selected: !device.selected } : device,
      ),
    )
  }

  function disconnectOne(deviceId) {
    const deviceRecord = devicesRef.current.find((device) => device.id === deviceId)
    if (!deviceRecord) {
      return
    }

    manualDisconnectIdsRef.current.add(deviceId)
    disconnectDevice(deviceRecord)
    removeDevice(deviceId)
    setStatusMessage(`${deviceRecord.name} 已手動斷線`)
    addLog('手動中斷連線', deviceRecord.name)
  }

  function disconnectEverything() {
    const connectedDevices = devicesRef.current.filter((device) => device.connected)
    connectedDevices.forEach((device) => {
      manualDisconnectIdsRef.current.add(device.id)
    })
    disconnectAllDevices(connectedDevices)
    setDevices([])
    setStatusMessage('所有裝置已中斷連線')
    addLog('中斷所有裝置連線')
  }

  function subscribeToNotifications(listener) {
    notificationListenersRef.current.add(listener)
    return () => {
      notificationListenersRef.current.delete(listener)
    }
  }

  return (
    <BluetoothContext.Provider
      value={{
        mode,
        devices,
        isSupported,
        isConnecting,
        statusMessage,
        lastBatchResult,
        setMode,
        connectDevice,
        updateDevice,
        writeToDevice,
        broadcastPayload,
        toggleDeviceSelection,
        disconnectDevice: disconnectOne,
        disconnectAll: disconnectEverything,
        subscribeToNotifications,
        clearBatchResult: () => setLastBatchResult(null),
      }}
    >
      {children}
    </BluetoothContext.Provider>
  )
}

export function useBluetoothContext() {
  const context = useContext(BluetoothContext)

  if (!context) {
    throw new Error('useBluetoothContext must be used within BluetoothProvider')
  }

  return context
}
