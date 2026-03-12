import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ControlPanel from './ControlPanel.jsx'

describe('ControlPanel', () => {
  it('disables controls when user mode is not ready', () => {
    render(
      <ControlPanel
        batchResult={null}
        controlEnabled={false}
        isBusy={false}
        onDisconnectAll={vi.fn()}
        onSendCommand={vi.fn()}
        onSendMessage={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '發送 MSG' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '發送 CMD:FLASH:1' })).toBeDisabled()
  })

  it('enables quick command buttons when allowed', () => {
    render(
      <ControlPanel
        batchResult={null}
        controlEnabled
        isBusy={false}
        onDisconnectAll={vi.fn()}
        onSendCommand={vi.fn()}
        onSendMessage={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '發送 CMD:FLASH:1' })).toBeEnabled()
  })
})
