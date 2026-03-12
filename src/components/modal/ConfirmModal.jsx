function ConfirmModal({ message, title, onCancel, onConfirm }) {
  return (
    <div className="modal-card">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="button button--ghost" onClick={() => onCancel(false)} type="button">
          取消
        </button>
        <button className="button button--primary" onClick={() => onConfirm(true)} type="button">
          確認
        </button>
      </div>
    </div>
  )
}

export default ConfirmModal
