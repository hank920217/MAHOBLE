import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LogProvider, useLogContext } from './LogContext.jsx'

function TestHarness() {
  const { logs, addLog, clearLogs } = useLogContext()

  return (
    <div>
      <button onClick={() => addLog('事件A', 'maho-01')} type="button">
        add
      </button>
      <button onClick={clearLogs} type="button">
        clear
      </button>
      <span>{logs.length}</span>
    </div>
  )
}

describe('LogContext', () => {
  it('adds and clears logs', () => {
    render(
      <LogProvider>
        <TestHarness />
      </LogProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getByText('1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'clear' }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
