import DeviceItem from './DeviceItem.jsx'

function DeviceList({
  devices,
  allowReauth,
  onDisconnect,
  onReauthenticate,
  onToggleSelected,
}) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Connected Devices</p>
          <h2>已連線裝置列表</h2>
        </div>
      </div>

      {devices.length === 0 ? (
        <p className="empty-state">目前沒有已連線裝置。</p>
      ) : (
        <ul className="device-list">
          {devices.map((device) => (
            <DeviceItem
              allowReauth={allowReauth}
              deviceRecord={device}
              key={device.id}
              onDisconnect={() => onDisconnect(device.id)}
              onReauthenticate={() => onReauthenticate(device.id)}
              onToggleSelected={onToggleSelected}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default DeviceList
