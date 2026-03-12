import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ModalProvider } from '../../context/ModalContext.jsx'
import useModal from '../../hooks/useModal.js'
import ModalRoot from './ModalRoot.jsx'

function ModalHarness() {
  const { openConfirm, openInput } = useModal()

  return (
    <>
      <button
        onClick={() =>
          openConfirm({
            title: 'Confirm action',
            message: 'Proceed with this change?',
          })
        }
        type="button"
      >
        Open confirm
      </button>
      <button
        onClick={() =>
          openInput({
            title: 'Device verification',
            message: 'Enter verification code',
          })
        }
        type="button"
      >
        Open input
      </button>
      <ModalRoot />
    </>
  )
}

function renderModalHarness() {
  return render(
    <ModalProvider>
      <ModalHarness />
    </ModalProvider>,
  )
}

describe('ModalRoot', () => {
  it('closes a confirm dialog when clicking the overlay', () => {
    renderModalHarness()

    fireEvent.click(screen.getByRole('button', { name: 'Open confirm' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('submits input dialogs through the explicit confirm button', () => {
    renderModalHarness()

    fireEvent.click(screen.getByRole('button', { name: 'Open input' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: '確定' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
