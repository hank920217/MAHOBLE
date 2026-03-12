import { formatClockTime } from '../../utils/formatters.js'

function LogItem({ log }) {
  return (
    <li className="log-item">
      <span>{formatClockTime(log.timestamp)}</span>
      <strong>{log.event}</strong>
      <span>{log.deviceName}</span>
    </li>
  )
}

export default LogItem
