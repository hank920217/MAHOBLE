import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

if (!globalThis.crypto?.randomUUID) {
  globalThis.crypto = {
    ...globalThis.crypto,
    randomUUID: () => '00000000-0000-4000-8000-000000000000',
  }
}
