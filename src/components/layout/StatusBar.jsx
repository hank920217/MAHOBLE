function StatusBar({
  modeLabel,
  isSupported,
  connectedCount,
  selectedCount,
  controlEnabled,
  statusMessage,
  lastBatchResult,
}) {
  return (
    <section className="panel status-panel">
      <div className="status-grid">
        <div>
          <span className="status-panel__label">目前模式</span>
          <strong>{modeLabel}</strong>
        </div>
        <div>
          <span className="status-panel__label">瀏覽器支援</span>
          <strong>{isSupported ? '可用' : '不支援'}</strong>
        </div>
        <div>
          <span className="status-panel__label">連線裝置</span>
          <strong>{connectedCount} 台</strong>
        </div>
        <div>
          <span className="status-panel__label">已選擇裝置</span>
          <strong>{selectedCount} 台</strong>
        </div>
        <div>
          <span className="status-panel__label">控制權限</span>
          <strong>{controlEnabled ? '可操作' : '尚未開放'}</strong>
        </div>
        <div>
          <span className="status-panel__label">最新狀態</span>
          <strong>{statusMessage}</strong>
        </div>
      </div>

      {lastBatchResult && (
        <p className="status-panel__batch">
          最近一次群發結果：成功 {lastBatchResult.successCount} 台，失敗{' '}
          {lastBatchResult.failureCount} 台
        </p>
      )}
    </section>
  )
}

export default StatusBar
