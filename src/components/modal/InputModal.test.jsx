import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import InputModal from './InputModal.jsx'

describe('InputModal', () => {
  it('shows an inline error message when provided', () => {
    render(
      <InputModal
        errorMessage="驗證碼錯誤，請重新輸入"
        message="請輸入驗證碼"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        placeholder="例如：1234"
        title="驗證裝置"
      />,
    )

    expect(screen.getByText('驗證碼錯誤，請重新輸入')).toBeInTheDocument()
  })

  it('uses custom submit handling without closing immediately', async () => {
    const onSubmit = vi.fn()
    const onConfirm = vi.fn()

    render(
      <InputModal
        message="請輸入驗證碼"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
        onSubmit={onSubmit}
        placeholder="例如：1234"
        title="驗證裝置"
      />,
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: '確定' }))

    expect(onSubmit).toHaveBeenCalledWith('1234')
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
