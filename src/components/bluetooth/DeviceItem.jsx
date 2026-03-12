import {
  formatAuthStatus,
  formatClockTime,
  formatConnectionStatus,
  formatRoleMode,
} from '../../utils/formatters.js'

function DeviceItem({
  deviceRecord,
  allowReauth,
  onDisconnect,
  onReauthenticate,
  onToggleSelected,
}) {
  return (
    <li className="device-item">
      <label className="device-item__select">
        <input
          checked={deviceRecord.selected}
          onChange={() => onToggleSelected(deviceRecord.id)}
          type="checkbox"
        />
        <span>選取</span>
      </label>

      <div className="device-item__content">
        <strong>{deviceRecord.name}</strong>
        <p>
          {formatConnectionStatus(deviceRecord.connected)} |{' '}
          {formatAuthStatus(deviceRecord.lastAuthStatus, deviceRecord.authenticated)} |{' '}
          {formatRoleMode(deviceRecord.role)}
        </p>
        <p>最後回應：{formatClockTime(deviceRecord.lastResponseTime)}</p>
      </div>

      <div className="device-item__actions">
        {allowReauth && (
          <button className="button button--secondary" onClick={onReauthenticate} type="button">
            重新驗證
          </button>
        )}
        <button className="button button--ghost" onClick={onDisconnect} type="button">
          中斷連線
        </button>
      </div>
    </li>
  )
}

export default DeviceItem
