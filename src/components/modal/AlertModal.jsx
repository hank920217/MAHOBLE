function AlertModal({ message, title, onConfirm }) {
  return (
    <div className="modal-card">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="button button--primary" onClick={() => onConfirm(true)} type="button">
          確定
        </button>
      </div>
    </div>
  )
}

export default AlertModal
