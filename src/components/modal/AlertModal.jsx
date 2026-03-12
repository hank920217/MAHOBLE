function AlertModal({ message, title, onClose, onConfirm }) {
  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="modal-card"
      onClick={(event) => event.stopPropagation()}
      role="dialog"
    >
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          aria-label="Close dialog"
          className="modal-close"
          onClick={onClose}
          type="button"
        >
          關閉
        </button>
      </div>
      <p>{message}</p>
      <div className="modal-actions">
        <button
          className="button button--primary button--modal-primary"
          onClick={() => onConfirm(true)}
          type="button"
        >
          確定
        </button>
      </div>
    </div>
  )
}

export default AlertModal
