import { createContext, useContext } from 'react'
import type { AppNotification, Redemption, Transaction, User } from '@/types'
import type { DemoScenario } from '@/services/aiService'
import type { wasteService } from '@/services/wasteService'

export interface PersistedState {
  user: User | null
  transactions: Transaction[]
  redemptions: Redemption[]
  notifications: AppNotification[]
  scenario: DemoScenario
}

export interface AppValue extends PersistedState {
  stats: ReturnType<typeof wasteService.computeStats>
  penalties: Transaction[]
  unreadCount: number
  signIn: (user: User) => void
  signOut: () => void
  addTransaction: (t: Transaction) => void
  addRedemption: (r: Redemption) => void
  pushNotifications: (n: AppNotification[]) => void
  markAllRead: () => void
  setScenario: (s: DemoScenario) => void
  resetDemo: () => void
}

export const AppCtx = createContext<AppValue | null>(null)

export function useApp() {
  const v = useContext(AppCtx)
  if (!v) throw new Error('useApp must be used inside <AppProvider>')
  return v
}
