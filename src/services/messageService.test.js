import { describe, expect, it, vi } from 'vitest'
import { createAuthMessage, sendPayloadToDevices } from './messageService.js'
import { APP_MODES } from '../utils/constants.js'

describe('messageService', () => {
  it('formats auth message with role and code', () => {
    expect(createAuthMessage(APP_MODES.USER, ' 1234 ')).toBe('AUTH:USER:1234')
    expect(createAuthMessage(APP_MODES.ADMIN, '9999')).toBe('AUTH:ADMIN:9999')
  })

  it('keeps broadcasting when one device fails', async () => {
    const writer = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValueOnce(undefined)

    const result = await sendPayloadToDevices(
      [
        { id: '1', name: 'maho-01' },
        { id: '2', name: 'maho-02' },
        { id: '3', name: 'maho-03' },
      ],
      '1',
      writer,
    )

    expect(result.successCount).toBe(2)
    expect(result.failureCount).toBe(1)
    expect(result.perDeviceResults[1].ok).toBe(false)
  })
})
