/** Core domain types for ENGO. Shared by mock services today and
 *  by the real API/IoT services later — the UI never depends on either. */

export type WasteType = 'organic' | 'plastic' | 'paper' | 'metal' | 'glass' | 'other'

/** Outcome of a deposit as judged by the bin's classifier. */
export type DepositStatus = 'accepted' | 'incorrect' | 'rejected'

export interface User {
  id: string
  name: string
  department: string
  email: string
  rfidCard: string
  joinedAt: string
  status: 'active' | 'suspended'
  avatar: string
}

export interface Transaction {
  id: string
  userId: string
  binId: string
  wasteType: WasteType
  weightKg: number
  confidence: number
  status: DepositStatus
  /** Positive for rewards, negative for penalties. */
  points: number
  /** Monetary fine in INR. 0 when there is none. */
  fine: number
  /** Short human-readable reason, present on penalised deposits. */
  reason?: string
  timestamp: string
}

export interface Reward {
  id: string
  name: string
  description: string
  cost: number
  icon: 'badge' | 'coupon' | 'tree' | 'bottle' | 'kit'
}

export interface Redemption {
  id: string
  rewardId: string
  rewardName: string
  points: number
  timestamp: string
}

export type NotificationKind = 'success' | 'reward' | 'warning' | 'info'

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  timestamp: string
  read: boolean
}

export interface SmartBin {
  id: string
  label: string
  location: string
  accepts: WasteType[]
  fillLevel: number
  online: boolean
}

/** What the vision model returns. `aiService` produces this today from
 *  mock data; a Replicate-backed service will produce the same shape. */
export interface AIResult {
  wasteType: WasteType
  confidence: number
  weightKg: number
  status: DepositStatus
  reason?: string
  /** Local image representing the captured frame. */
  imageKey: WasteType
}

export interface UserStats {
  ecoScore: number
  totalWasteKg: number
  monthWasteKg: number
  points: number
  penaltyPoints: number
  fineAmount: number
  deposits: number
  ecoLevel: string
}
