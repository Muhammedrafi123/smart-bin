import type { AIResult, Transaction, UserStats } from '@/types'
import { LEGACY_TOTALS } from '@/data/users'
import { ecoLevelFor } from '@/data/rewards'
import { ACTIVE_BIN } from '@/data/bins'

/** Reward rate applied to correctly sorted waste. */
const POINTS_PER_KG = 20

const FINE_BY_STATUS: Record<'incorrect' | 'rejected', number> = {
  incorrect: 20,
  rejected: 20,
}

const PENALTY_POINTS: Record<'incorrect' | 'rejected', number> = {
  incorrect: -10,
  rejected: -20,
}

let sequence = 10291

/** Scoring lives here so the UI never has to know the rules. */
export const wasteService = {
  nextTransactionId() {
    sequence += Math.floor(Math.random() * 9) + 3
    return `WT-${sequence}`
  },

  /** Turns a classifier result into the permanent transaction record. */
  createTransaction(result: AIResult, userId: string, binId = ACTIVE_BIN.id): Transaction {
    const flagged = result.status === 'accepted' ? null : result.status
    const points = flagged
      ? PENALTY_POINTS[flagged]
      : Math.max(1, Math.round(result.weightKg * POINTS_PER_KG))
    const fine = flagged ? FINE_BY_STATUS[flagged] : 0

    return {
      id: this.nextTransactionId(),
      userId,
      binId,
      wasteType: result.wasteType,
      weightKg: result.weightKg,
      confidence: result.confidence,
      status: result.status,
      points,
      fine,
      reason: result.reason,
      timestamp: new Date().toISOString(),
    }
  },

  /** All headline numbers are derived from one list — never duplicated per screen. */
  computeStats(transactions: Transaction[], redeemedPoints: number): UserStats {
    const now = new Date()
    let earned = 0
    let penaltyPoints = 0
    let fineAmount = 0
    let totalWasteKg = 0
    let monthWasteKg = 0

    for (const t of transactions) {
      totalWasteKg += t.weightKg
      const d = new Date(t.timestamp)
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        monthWasteKg += t.weightKg
      }
      if (t.points >= 0) earned += t.points
      else penaltyPoints += t.points
      fineAmount += t.fine
    }

    const points = LEGACY_TOTALS.points + earned + penaltyPoints - redeemedPoints
    const ecoScore = LEGACY_TOTALS.ecoScoreBase + earned + penaltyPoints

    return {
      ecoScore,
      totalWasteKg: LEGACY_TOTALS.totalWasteKg + totalWasteKg,
      monthWasteKg: LEGACY_TOTALS.monthWasteKg + monthWasteKg,
      points,
      penaltyPoints,
      fineAmount,
      deposits: LEGACY_TOTALS.deposits + transactions.length,
      ecoLevel: ecoLevelFor(ecoScore),
    }
  },

  penalties(transactions: Transaction[]) {
    return transactions.filter((t) => t.points < 0)
  },
}
