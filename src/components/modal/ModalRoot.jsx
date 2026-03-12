import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import useModal from '../../hooks/useModal.js'
import AlertModal from './AlertModal.jsx'
import ConfirmModal from './ConfirmModal.jsx'
import InputModal from './InputModal.jsx'

function ModalRoot() {
  const { activeModal, closeModal } = useModal()
  const modalType = activeModal?.type
  const dismissValue = modalType === 'input' ? null : modalType === 'confirm' ? false : undefined

  function handleDismiss() {
    closeModal(dismissValue)
  }

  useEffect(() => {
    if (!activeModal) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeModal(dismissValue)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModal, closeModal, dismissValue])

  if (!activeModal) {
    return null
  }

  let content = null

  if (activeModal.type === 'alert') {
    content = <AlertModal {...activeModal.options} onConfirm={closeModal} />
  }

  if (activeModal.type === 'confirm') {
    content = (
      <ConfirmModal
        {...activeModal.options}
        onCancel={closeModal}
        onConfirm={closeModal}
      />
    )
  }

  if (activeModal.type === 'input') {
    content = (
      <InputModal
        {...activeModal.options}
        onCancel={closeModal}
        onConfirm={closeModal}
      />
    )
  }

  return createPortal(
    <div className="modal-overlay" data-testid="modal-overlay" onClick={handleDismiss}>
      <div className="modal-shell">{content}</div>
    </div>,
    document.body,
  )
}

export default ModalRoot
