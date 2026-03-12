import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { BluetoothProvider } from './context/BluetoothContext.jsx'
import { LogProvider } from './context/LogContext.jsx'
import { ModalProvider } from './context/ModalContext.jsx'
import ModalRoot from './components/modal/ModalRoot.jsx'
import AppRouter from './router/index.jsx'

function App() {
  return (
    <AdminAuthProvider>
      <LogProvider>
        <ModalProvider>
          <BluetoothProvider>
            <AppRouter />
            <ModalRoot />
          </BluetoothProvider>
        </ModalProvider>
      </LogProvider>
    </AdminAuthProvider>
  )
}

export default App
