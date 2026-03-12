import { useState } from 'react'
import { COMMAND_LEVELS } from '../../utils/constants.js'

function ControlPanel({
  batchResult,
  controlEnabled,
  isBusy,
  onDisconnectAll,
  onSendCommand,
  onSendMessage,
}) {
  const [message, setMessage] = useState('')

  async function handleSendMessage() {
    if (!message.trim()) {
      return
    }

    const success = await onSendMessage(message)
    if (success) {
      setMessage('')
    }
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Controls</p>
          <h2>訊息與快捷控制</h2>
        </div>
      </div>

      <div className="message-box">
        <label className="field">
          <span>發送文字訊息</span>
          <textarea
            onChange={(event) => setMessage(event.target.value)}
            placeholder="輸入要送往 ESP32 的文字訊息"
            rows="4"
            value={message}
          />
        </label>

        <button
          className="button button--primary"
          disabled={!controlEnabled || isBusy || !message.trim()}
          onClick={handleSendMessage}
          type="button"
        >
          發送 MSG
        </button>
      </div>

      <div className="quick-grid">
        {COMMAND_LEVELS.map((level) => (
          <button
            className="button button--secondary"
            disabled={!controlEnabled || isBusy}
            key={level}
            onClick={() => onSendCommand(level)}
            type="button"
          >
            發送 {level}
          </button>
        ))}
      </div>

      <div className="panel__footer">
        <button className="button button--ghost" onClick={onDisconnectAll} type="button">
          中斷所有連線
        </button>

        {batchResult && (
          <p className="batch-result">
            成功 {batchResult.successCount} 台，失敗 {batchResult.failureCount} 台
          </p>
        )}
      </div>
    </section>
  )
}

export default ControlPanel
