import { useState } from 'react'

function InputModal({
  confirmText = '確認',
  message,
  onCancel,
  onConfirm,
  placeholder,
  title,
}) {
  const [value, setValue] = useState('')

  return (
    <div className="modal-card">
      <h2>{title}</h2>
      <p>{message}</p>

      <label className="field">
        <span>輸入內容</span>
        <input
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      </label>

      <div className="modal-actions">
        <button className="button button--ghost" onClick={() => onCancel(null)} type="button">
          取消
        </button>
        <button className="button button--primary" onClick={() => onConfirm(value)} type="button">
          {confirmText}
        </button>
      </div>
    </div>
  )
}

export default InputModal
