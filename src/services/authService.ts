import type { User } from '@/types'
import { DEMO_CREDENTIALS, DEMO_USER } from '@/data/users'
import { delay } from '@/lib/delay'

export interface AuthResult {
  ok: boolean
  user?: User
  error?: string
}

/** Mock auth. Swap this module for a real API client without touching the UI. */
export const authService = {
  async loginWithPassword(userId: string, password: string): Promise<AuthResult> {
    await delay(850)
    const idOk = userId.trim().toUpperCase() === DEMO_CREDENTIALS.userId
    if (!idOk) return { ok: false, error: 'No account found for that User ID.' }
    if (password !== DEMO_CREDENTIALS.password)
      return { ok: false, error: 'Incorrect password. Try again.' }
    return { ok: true, user: DEMO_USER }
  },

  async loginAsDemo(): Promise<AuthResult> {
    await delay(500)
    return { ok: true, user: DEMO_USER }
  },

  /** Simulates the RFID reader handshake used by the physical bin. */
  async scanCard(): Promise<AuthResult> {
    await delay(2200)
    return { ok: true, user: DEMO_USER }
  },
}
