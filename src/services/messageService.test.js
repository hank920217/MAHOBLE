import { describe, expect, it, vi } from 'vitest'
import { sendPayloadToDevices } from './messageService.js'

describe('messageService', () => {
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
      'CMD:FLASH:1',
      writer,
    )

    expect(result.successCount).toBe(2)
    expect(result.failureCount).toBe(1)
    expect(result.perDeviceResults[1].ok).toBe(false)
  })
})
