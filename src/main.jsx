import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import './styles/layout.css'
import './styles/user.css'
import './styles/admin.css'
import './styles/modal.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {})
    })
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }
}
