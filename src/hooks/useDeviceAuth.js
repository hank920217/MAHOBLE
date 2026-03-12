import { useEffect, useRef } from 'react'
import { createAuthMessage } from '../services/messageService.js'
import useBluetooth from './useBluetooth.js'
import useLogs from './useLogs.js'
import useModal from './useModal.js'
import { AUTH_RESPONSES, AUTH_TIMEOUT_MS } from '../utils/constants.js'
import { validateVerificationCode } from '../utils/validators.js'

function useDeviceAuth() {
  const { devices, subscribeToNotifications, updateDevice, writeToDevice } = useBluetooth()
  const { addLog } = useLogs()
  const { openAlert, openInput } = useModal()
  const pendingRequestsRef = useRef(new Map())

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((payload) => {
      const pendingRequest = pendingRequestsRef.current.get(payload.deviceId)
      if (!pendingRequest) {
        return
      }

      const isAuthMessage = [
        AUTH_RESPONSES.OK,
        AUTH_RESPONSES.FAIL,
        AUTH_RESPONSES.REQUIRED,
      ].includes(payload.message)

      if (!isAuthMessage) {
        return
      }

      clearTimeout(pendingRequest.timeoutId)
      pendingRequestsRef.current.delete(payload.deviceId)

      const authenticated = payload.message === AUTH_RESPONSES.OK
      updateDevice(payload.deviceId, {
        authenticated,
        lastAuthStatus: payload.message,
        lastResponseTime: new Date().toISOString(),
      })

      if (authenticated) {
        addLog('驗證成功', payload.deviceName)
        openAlert({
          title: '驗證成功',
          message: `${payload.deviceName} 已完成驗證。`,
        })
      } else {
        addLog('驗證失敗', payload.deviceName)
        openAlert({
          title: payload.message === AUTH_RESPONSES.REQUIRED ? '需重新驗證' : '驗證失敗',
          message: `${payload.deviceName} 尚未通過驗證，請重新輸入驗證碼。`,
        })
      }

      pendingRequest.resolve({ success: authenticated, status: payload.message })
    })

    return unsubscribe
  }, [addLog, openAlert, subscribeToNotifications, updateDevice])

  async function requestAuthentication(deviceId) {
    const deviceRecord = devices.find((device) => device.id === deviceId)
    if (!deviceRecord) {
      return { success: false, status: 'DEVICE_MISSING' }
    }

    const code = await openInput({
      title: `驗證 ${deviceRecord.name}`,
      message: '請輸入這台裝置的驗證碼。',
      placeholder: '例如：1234',
      confirmText: '送出驗證',
    })

    if (code === null) {
      updateDevice(deviceId, {
        authenticated: false,
        lastAuthStatus: AUTH_RESPONSES.CANCELLED,
      })
      addLog('取消驗證', deviceRecord.name)
      return { success: false, status: AUTH_RESPONSES.CANCELLED }
    }

    if (!validateVerificationCode(code)) {
      await openAlert({
        title: '驗證碼不可為空',
        message: '請重新輸入有效的驗證碼。',
      })
      return requestAuthentication(deviceId)
    }

    updateDevice(deviceId, {
      authenticated: false,
      lastAuthStatus: AUTH_RESPONSES.PENDING,
    })

    addLog(`送出驗證碼 ${createAuthMessage(code)}`, deviceRecord.name)

    return new Promise((resolve) => {
      const timeoutId = window.setTimeout(async () => {
        pendingRequestsRef.current.delete(deviceId)
        updateDevice(deviceId, {
          authenticated: false,
          lastAuthStatus: AUTH_RESPONSES.TIMEOUT,
        })
        addLog('驗證逾時', deviceRecord.name)
        await openAlert({
          title: '驗證逾時',
          message: `${deviceRecord.name} 在 5 秒內沒有回應，請重新驗證。`,
        })
        resolve({ success: false, status: AUTH_RESPONSES.TIMEOUT })
      }, AUTH_TIMEOUT_MS)

      pendingRequestsRef.current.set(deviceId, { resolve, timeoutId })

      writeToDevice(deviceId, createAuthMessage(code)).catch(async (error) => {
        clearTimeout(timeoutId)
        pendingRequestsRef.current.delete(deviceId)
        updateDevice(deviceId, {
          authenticated: false,
          lastAuthStatus: AUTH_RESPONSES.FAIL,
        })
        addLog('送出驗證失敗', deviceRecord.name)
        await openAlert({
          title: '送出失敗',
          message: error instanceof Error ? error.message : '無法送出驗證碼。',
        })
        resolve({ success: false, status: AUTH_RESPONSES.FAIL })
      })
    })
  }

  return { requestAuthentication }
}

export default useDeviceAuth
