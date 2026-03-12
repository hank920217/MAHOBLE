import LogItem from './LogItem.jsx'

function LogPanel({ logs, onClear }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>操作紀錄區</h2>
        </div>
        <button className="button button--ghost" onClick={onClear} type="button">
          清空紀錄
        </button>
      </div>

      {logs.length === 0 ? (
        <p className="empty-state">尚無操作紀錄。</p>
      ) : (
        <ul className="log-list">
          {[...logs].reverse().map((log) => (
            <LogItem key={log.id} log={log} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default LogPanel
