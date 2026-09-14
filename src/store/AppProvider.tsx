import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { SEED_TRANSACTIONS } from '@/data/transactions'
import { SEED_REDEMPTIONS } from '@/data/rewards'
import { SEED_NOTIFICATIONS } from '@/data/notifications'
import { wasteService } from '@/services/wasteService'
import { AppCtx } from './appContext'
import type { AppValue, PersistedState } from './appContext'

const KEY = 'engo.state.v1'

const seed = (): PersistedState => ({
  user: null,
  transactions: SEED_TRANSACTIONS,
  redemptions: SEED_REDEMPTIONS,
  notifications: SEED_NOTIFICATIONS,
  scenario: 'auto',
})

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return { ...seed(), ...(JSON.parse(raw) as Partial<PersistedState>) }
  } catch {
    return seed()
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable - the prototype still works in memory */
    }
  }, [state])

  const patch = useCallback((p: Partial<PersistedState>) => setState((s) => ({ ...s, ...p })), [])

  const redeemedPoints = useMemo(
    () => state.redemptions.reduce((sum, r) => sum + r.points, 0),
    [state.redemptions],
  )

  const stats = useMemo(
    () => wasteService.computeStats(state.transactions, redeemedPoints),
    [state.transactions, redeemedPoints],
  )

  const penalties = useMemo(() => wasteService.penalties(state.transactions), [state.transactions])

  const value: AppValue = {
    ...state,
    stats,
    penalties,
    unreadCount: state.notifications.filter((n) => !n.read).length,
    signIn: (user) => patch({ user }),
    signOut: () => patch({ user: null }),
    addTransaction: (t) => setState((s) => ({ ...s, transactions: [t, ...s.transactions] })),
    addRedemption: (r) => setState((s) => ({ ...s, redemptions: [r, ...s.redemptions] })),
    pushNotifications: (n) => setState((s) => ({ ...s, notifications: [...n, ...s.notifications] })),
    markAllRead: () =>
      setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    setScenario: (scenario) => patch({ scenario }),
    resetDemo: () => setState((s) => ({ ...seed(), user: s.user })),
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
