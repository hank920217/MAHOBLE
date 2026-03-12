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
  const { closeModal, openInput, updateActiveModal } = useModal()
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
        closeModal({
          success: true,
          status: payload.message,
        })
      } else {
        addLog('驗證失敗', payload.deviceName)
        updateActiveModal({
          errorMessage: '驗證碼錯誤，請重新輸入',
          isSubmitting: false,
        })
      }
    })

    return unsubscribe
  }, [addLog, closeModal, subscribeToNotifications, updateActiveModal, updateDevice])

  async function requestAuthentication(deviceOrId) {
    const deviceId = typeof deviceOrId === 'string' ? deviceOrId : deviceOrId?.id
    const connectedDevice =
      typeof deviceOrId === 'object' && deviceOrId !== null ? deviceOrId : null
    const deviceRecord = devices.find((device) => device.id === deviceId) ?? connectedDevice

    if (!deviceRecord) {
      return { success: false, status: 'DEVICE_MISSING' }
    }

    async function handleSubmit(code) {
      const trimmedCode = code.trim()

      if (!validateVerificationCode(trimmedCode)) {
        updateActiveModal({
          errorMessage: '請輸入驗證碼',
          isSubmitting: false,
        })
        return
      }

      if (pendingRequestsRef.current.has(deviceId)) {
        return
      }

      updateDevice(deviceId, {
        authenticated: false,
        lastAuthStatus: AUTH_RESPONSES.PENDING,
      })
      updateActiveModal({
        errorMessage: '',
        isSubmitting: true,
      })

      addLog(`送出驗證碼 ${createAuthMessage(trimmedCode)}`, deviceRecord.name)

      const timeoutId = window.setTimeout(() => {
        pendingRequestsRef.current.delete(deviceId)
        updateDevice(deviceId, {
          authenticated: false,
          lastAuthStatus: AUTH_RESPONSES.TIMEOUT,
        })
        addLog('驗證逾時', deviceRecord.name)
        updateActiveModal({
          errorMessage: '驗證逾時，請重新輸入',
          isSubmitting: false,
        })
      }, AUTH_TIMEOUT_MS)

      pendingRequestsRef.current.set(deviceId, { timeoutId })

      try {
        await writeToDevice(deviceId, createAuthMessage(trimmedCode))
      } catch (error) {
        clearTimeout(timeoutId)
        pendingRequestsRef.current.delete(deviceId)
        updateDevice(deviceId, {
          authenticated: false,
          lastAuthStatus: AUTH_RESPONSES.FAIL,
        })
        addLog('送出驗證失敗', deviceRecord.name)
        updateActiveModal({
          errorMessage: error instanceof Error ? error.message : '無法送出驗證碼。',
          isSubmitting: false,
        })
      }
    }

    const result = await openInput({
      title: `驗證 ${deviceRecord.name}`,
      message: '請輸入這台裝置的驗證碼。',
      placeholder: '例如：1234',
      confirmText: '確定',
      errorMessage: '',
      isSubmitting: false,
      onSubmit: handleSubmit,
    })

    const pendingRequest = pendingRequestsRef.current.get(deviceId)
    if (pendingRequest) {
      clearTimeout(pendingRequest.timeoutId)
      pendingRequestsRef.current.delete(deviceId)
    }

    if (result === null) {
      updateDevice(deviceId, {
        authenticated: false,
        lastAuthStatus: AUTH_RESPONSES.CANCELLED,
      })
      addLog('取消驗證', deviceRecord.name)
      return { success: false, status: AUTH_RESPONSES.CANCELLED }
    }

    return result
  }

  return { requestAuthentication }
}

export default useDeviceAuth
