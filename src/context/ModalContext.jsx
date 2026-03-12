import { createContext, useContext, useState } from 'react'

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  const [modalQueue, setModalQueue] = useState([])

  function enqueueModal(type, options = {}) {
    return new Promise((resolve) => {
      setModalQueue((currentQueue) => [
        ...currentQueue,
        {
          id: crypto.randomUUID(),
          type,
          options,
          resolve,
        },
      ])
    })
  }

  function resolveActiveModal(value) {
    setModalQueue((currentQueue) => {
      const [activeModal, ...restQueue] = currentQueue
      activeModal?.resolve(value)
      return restQueue
    })
  }

  return (
    <ModalContext.Provider
      value={{
        activeModal: modalQueue[0] ?? null,
        openAlert: (options) => enqueueModal('alert', options),
        openConfirm: (options) => enqueueModal('confirm', options),
        openInput: (options) => enqueueModal('input', options),
        closeModal: resolveActiveModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModalContext() {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModalContext must be used within ModalProvider')
  }

  return context
}
