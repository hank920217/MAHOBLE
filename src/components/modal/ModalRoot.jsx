import { createPortal } from 'react-dom'
import useModal from '../../hooks/useModal.js'
import AlertModal from './AlertModal.jsx'
import ConfirmModal from './ConfirmModal.jsx'
import InputModal from './InputModal.jsx'

function ModalRoot() {
  const { activeModal, closeModal } = useModal()

  if (!activeModal) {
    return null
  }

  let content = null

  if (activeModal.type === 'alert') {
    content = <AlertModal {...activeModal.options} onConfirm={closeModal} />
  }

  if (activeModal.type === 'confirm') {
    content = (
      <ConfirmModal {...activeModal.options} onCancel={closeModal} onConfirm={closeModal} />
    )
  }

  if (activeModal.type === 'input') {
    content = <InputModal {...activeModal.options} onCancel={closeModal} onConfirm={closeModal} />
  }

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-shell">{content}</div>
    </div>,
    document.body,
  )
}

export default ModalRoot
