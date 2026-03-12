import { createContext, useContext, useState } from 'react'
import { MAX_LOG_ENTRIES } from '../utils/constants.js'

const LogContext = createContext(null)

export function LogProvider({ children }) {
  const [logs, setLogs] = useState([])

  function addLog(event, deviceName = '系統') {
    setLogs((currentLogs) => {
      const nextLogs = [
        ...currentLogs,
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          event,
          deviceName,
        },
      ]

      return nextLogs.slice(-MAX_LOG_ENTRIES)
    })
  }

  function clearLogs() {
    setLogs([])
  }

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  )
}

export function useLogContext() {
  const context = useContext(LogContext)

  if (!context) {
    throw new Error('useLogContext must be used within LogProvider')
  }

  return context
}
