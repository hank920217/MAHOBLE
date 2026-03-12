function ConfirmModal({ message, title, onCancel, onConfirm }) {
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
      </div>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="button button--ghost" onClick={() => onCancel(false)} type="button">
          取消
        </button>
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

export default ConfirmModal
