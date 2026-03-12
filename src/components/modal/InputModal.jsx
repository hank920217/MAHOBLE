import { useState } from 'react'

function InputModal({
  confirmText = '確定',
  message,
  onCancel,
  onClose,
  onConfirm,
  placeholder,
  title,
}) {
  const [value, setValue] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onConfirm(value)
  }

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

      <form className="modal-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>驗證碼</span>
          <input
            autoFocus
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            value={value}
          />
        </label>

        <div className="modal-actions">
          <button className="button button--ghost" onClick={() => onCancel(null)} type="button">
            取消
          </button>
          <button className="button button--primary button--modal-primary" type="submit">
            {confirmText}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InputModal
