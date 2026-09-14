import type { AppNotification } from '@/types'

const ago = (hours: number) => new Date(Date.now() - hours * 36e5).toISOString()

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NT-501',
    kind: 'success',
    title: 'Waste successfully deposited',
    body: '0.80 kg of organic waste recorded at Bin B2.',
    timestamp: ago(3),
    read: false,
  },
  {
    id: 'NT-500',
    kind: 'reward',
    title: 'You earned 16 Eco Points',
    body: 'Your balance is now 320 points. 180 to go for Plant a Tree.',
    timestamp: ago(3),
    read: false,
  },
  {
    id: 'NT-499',
    kind: 'info',
    title: 'Bin collection completed',
    body: 'Bin B2 at the Central Canteen was emptied and is ready to use.',
    timestamp: ago(21),
    read: true,
  },
  {
    id: 'NT-498',
    kind: 'warning',
    title: 'Incorrect classification detected',
    body: 'Plastic was placed in the organic bin. A ₹20 fine was applied.',
    timestamp: ago(50),
    read: true,
  },
  {
    id: 'NT-497',
    kind: 'info',
    title: 'Weekly eco report is ready',
    body: 'You diverted 3.2 kg of waste from landfill last week. Nice work.',
    timestamp: ago(96),
    read: true,
  },
]
