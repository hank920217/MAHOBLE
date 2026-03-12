import { useEffect, useState } from 'react'
import ConnectButton from '../components/bluetooth/ConnectButton.jsx'
import ControlPanel from '../components/bluetooth/ControlPanel.jsx'
import DeviceList from '../components/bluetooth/DeviceList.jsx'
import PageLayout from '../components/layout/PageLayout.jsx'
import StatusBar from '../components/layout/StatusBar.jsx'
import LogPanel from '../components/log/LogPanel.jsx'
import useBluetooth from '../hooks/useBluetooth.js'
import useDeviceAuth from '../hooks/useDeviceAuth.js'
import useLogs from '../hooks/useLogs.js'
import useModal from '../hooks/useModal.js'
import { APP_MODES } from '../utils/constants.js'
import { formatRoleMode } from '../utils/formatters.js'

function UserPage() {
  const [isSending, setIsSending] = useState(false)
  const bluetooth = useBluetooth()
  const { requestAuthentication } = useDeviceAuth()
  const { logs, clearLogs } = useLogs()
  const { openAlert } = useModal()

  useEffect(() => {
    bluetooth.setMode(APP_MODES.USER)
  }, [bluetooth])

  async function handleConnect() {
    try {
      const device = await bluetooth.connectDevice(APP_MODES.USER)

      if (device) {
        await requestAuthentication(device)
      }
    } catch (error) {
      await openAlert({
        title: '連線失敗',
        message: error instanceof Error ? error.message : '無法完成藍牙連線。',
      })
    }
  }

  async function handleSendMessage(message) {
    try {
      setIsSending(true)
      await bluetooth.sendTextMessage(message)
      return true
    } catch (error) {
      await openAlert({
        title: '發送失敗',
        message: error instanceof Error ? error.message : '訊息發送失敗。',
      })
      return false
    } finally {
      setIsSending(false)
    }
  }

  async function handleSendCommand(level) {
    try {
      setIsSending(true)
      await bluetooth.sendQuickCommand(level)
    } catch (error) {
      await openAlert({
        title: '發送失敗',
        message: error instanceof Error ? error.message : '快捷命令發送失敗。',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <PageLayout
      mode={APP_MODES.USER}
      subtitle="首頁預設為使用者模式，所有裝置都驗證成功後才會開放控制。"
      title="ESP32 Web Bluetooth 控制系統"
    >
      <div className="hero-card">
        <div>
          <p className="eyebrow">User Mode</p>
          <h2>使用者模式控制台</h2>
          <p>支援多裝置連線、逐台驗證、批次發送與操作紀錄追蹤。</p>
        </div>
        <ConnectButton
          disabled={!bluetooth.isSupported}
          loading={bluetooth.isConnecting}
          onConnect={handleConnect}
        />
      </div>

      <StatusBar
        connectedCount={bluetooth.connectedDevices.length}
        controlEnabled={bluetooth.controlEnabled}
        isSupported={bluetooth.isSupported}
        lastBatchResult={bluetooth.lastBatchResult}
        modeLabel={formatRoleMode(APP_MODES.USER)}
        selectedCount={bluetooth.selectedDevices.length}
        statusMessage={bluetooth.statusMessage}
      />

      <div className="content-grid">
        <div className="stack">
          <ControlPanel
            batchResult={bluetooth.lastBatchResult}
            controlEnabled={bluetooth.controlEnabled}
            isBusy={isSending}
            onDisconnectAll={bluetooth.disconnectAll}
            onSendCommand={handleSendCommand}
            onSendMessage={handleSendMessage}
          />
          <DeviceList
            allowReauth
            devices={bluetooth.connectedDevices}
            onDisconnect={bluetooth.disconnectDevice}
            onReauthenticate={requestAuthentication}
            onToggleSelected={bluetooth.toggleDeviceSelection}
          />
        </div>

        <LogPanel logs={logs} onClear={clearLogs} />
      </div>
    </PageLayout>
  )
}

export default UserPage
