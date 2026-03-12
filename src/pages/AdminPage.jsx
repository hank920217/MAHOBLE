import { useEffect, useState } from "react";
import ConnectButton from "../components/bluetooth/ConnectButton.jsx";
import ControlPanel from "../components/bluetooth/ControlPanel.jsx";
import DeviceList from "../components/bluetooth/DeviceList.jsx";
import PageLayout from "../components/layout/PageLayout.jsx";
import StatusBar from "../components/layout/StatusBar.jsx";
import LogPanel from "../components/log/LogPanel.jsx";
import useBluetooth from "../hooks/useBluetooth.js";
import useLogs from "../hooks/useLogs.js";
import useModal from "../hooks/useModal.js";
import { APP_MODES } from "../utils/constants.js";
import { formatRoleMode } from "../utils/formatters.js";

function AdminPage() {
  const [isSending, setIsSending] = useState(false);
  const bluetooth = useBluetooth();
  const { logs, clearLogs } = useLogs();
  const { openAlert } = useModal();

  useEffect(() => {
    bluetooth.setMode(APP_MODES.ADMIN);
  }, [bluetooth]);

  async function handleConnect() {
    try {
      await bluetooth.connectDevice(APP_MODES.ADMIN);
    } catch (error) {
      await openAlert({
        title: "連線失敗",
        message: error instanceof Error ? error.message : "無法完成藍牙連線。",
      });
    }
  }

  async function handleSendMessage(message) {
    try {
      setIsSending(true);
      await bluetooth.sendTextMessage(message);
      return true;
    } catch (error) {
      await openAlert({
        title: "發送失敗",
        message: error instanceof Error ? error.message : "訊息發送失敗。",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  }

  async function handleSendCommand(level) {
    try {
      setIsSending(true);
      await bluetooth.sendQuickCommand(level);
    } catch (error) {
      await openAlert({
        title: "發送失敗",
        message: error instanceof Error ? error.message : "快捷命令發送失敗。",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <PageLayout
      mode={APP_MODES.ADMIN}
      subtitle="管理者模式會略過驗證碼流程，但仍需先完成藍牙連線。"
      title="ESP32 管理者控制台"
    >
      <div className="hero-card hero-card--admin">
        <div>
          <p className="eyebrow">Admin Mode</p>
          <h2>管理者模式控制台</h2>
          <p>可直接操作已連線裝置，並保留未來擴充的管理功能區塊。</p>
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
        modeLabel={formatRoleMode(APP_MODES.ADMIN)}
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
            allowReauth={false}
            devices={bluetooth.connectedDevices}
            onDisconnect={bluetooth.disconnectDevice}
            onReauthenticate={() => {}}
            onToggleSelected={bluetooth.toggleDeviceSelection}
          />
          <section className="panel admin-extension-panel">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Extensibility</p>
                <h2>未來管理功能預留(目前無實際功用)</h2>
              </div>
            </div>

            <div className="future-grid">
              <button className="chip" type="button">
                廣播訊息
              </button>
              <button className="chip" type="button">
                強制重新驗證
              </button>
              <button className="chip" type="button">
                顯示裝置狀態
              </button>
              <button className="chip" type="button">
                個別裝置控制
              </button>
              <button className="chip" type="button">
                重新掃描裝置
              </button>
              <button className="chip" type="button">
                全部斷線
              </button>
            </div>
          </section>
        </div>

        <LogPanel logs={logs} onClear={clearLogs} />
      </div>
    </PageLayout>
  );
}

export default AdminPage;
