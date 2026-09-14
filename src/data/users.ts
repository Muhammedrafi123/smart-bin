import type { User } from '@/types'
import avatar from '@/assets/images/avatar-rahul.jpg'

export const DEMO_USER: User = {
  id: 'USR-001',
  name: 'Rahul Kumar',
  department: 'Computer Science',
  email: 'rahul.kumar@campus.edu',
  rfidCard: '•••• 8291',
  joinedAt: '2026-08-10T09:00:00',
  status: 'active',
  avatar,
}

/** Accepted credentials for the prototype's login screen. */
export const DEMO_CREDENTIALS = { userId: 'USR-001', password: 'engo' }

/** Totals accumulated before the deposits kept in local history.
 *  Keeps the demo profile realistically "lived in" without seeding
 *  dozens of rows the user would have to scroll through. */
export const LEGACY_TOTALS = {
  totalWasteKg: 19.2,
  monthWasteKg: 2.85,
  points: 395,
  deposits: 38,
  ecoScoreBase: 795,
}
