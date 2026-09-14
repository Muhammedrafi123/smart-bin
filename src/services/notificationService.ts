import type { AppNotification, NotificationKind, Transaction } from '@/types'
import { WASTE_META } from '@/lib/waste'
import { kg } from '@/lib/format'

let seq = 600

const make = (kind: NotificationKind, title: string, body: string): AppNotification => ({
  id: `NT-${seq++}`,
  kind,
  title,
  body,
  timestamp: new Date().toISOString(),
  read: false,
})

export const notificationService = {
  /** Notifications the bin would push after a deposit completes. */
  forTransaction(t: Transaction): AppNotification[] {
    const label = WASTE_META[t.wasteType].label.toLowerCase()
    if (t.status === 'accepted') {
      return [
        make('reward', `You earned ${t.points} Eco Points`, `Keep it up — your balance just went up.`),
        make(
          'success',
          'Waste successfully deposited',
          `${kg(t.weightKg)} of ${label} waste recorded at ${t.binId}.`,
        ),
      ]
    }
    return [
      make(
        'warning',
        'Incorrect waste classification detected',
        `${t.reason}. ${t.points} points${t.fine ? ` and a ₹${t.fine} fine` : ''} applied.`,
      ),
    ]
  },

  forRedemption(rewardName: string, cost: number): AppNotification {
    return make('reward', `${rewardName} redeemed`, `${cost} points were deducted from your balance.`)
  },
}
