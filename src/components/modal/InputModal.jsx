import { useState } from 'react'

function InputModal({
  confirmText = '確定',
  errorMessage = '',
  isSubmitting = false,
  message,
  onCancel,
  onConfirm,
  onSubmit,
  placeholder,
  title,
}) {
  const [value, setValue] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (onSubmit) {
      await onSubmit(value)
      return
    }

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
      </div>
      <p>{message}</p>

      <form className="modal-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>驗證碼</span>
          <input
            autoFocus
            disabled={isSubmitting}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            value={value}
          />
        </label>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

        <div className="modal-actions">
          <button
            className="button button--ghost"
            onClick={() => onCancel(null)}
            type="button"
          >
            取消
          </button>
          <button
            className="button button--primary button--modal-primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '驗證中...' : confirmText}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InputModal
