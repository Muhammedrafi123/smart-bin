import type { Redemption, Reward } from '@/types'

export const REWARD_CATALOGUE: Reward[] = [
  {
    id: 'RW-01',
    name: 'Eco Badge',
    description: 'Digital badge on your campus profile',
    cost: 100,
    icon: 'badge',
  },
  {
    id: 'RW-02',
    name: 'Campus Coupon',
    description: '₹100 off at the campus canteen',
    cost: 250,
    icon: 'coupon',
  },
  {
    id: 'RW-03',
    name: 'Plant a Tree',
    description: 'A sapling planted in your name',
    cost: 500,
    icon: 'tree',
  },
  {
    id: 'RW-04',
    name: 'Steel Bottle',
    description: 'Reusable ENGO water bottle',
    cost: 750,
    icon: 'bottle',
  },
  {
    id: 'RW-05',
    name: 'Green Starter Kit',
    description: 'Tote bag, seeds and compost guide',
    cost: 1000,
    icon: 'kit',
  },
]

const daysAgo = (n: number, h = 12, m = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export const SEED_REDEMPTIONS: Redemption[] = [
  { id: 'RD-2041', rewardId: 'RW-01', rewardName: 'Eco Badge', points: 100, timestamp: daysAgo(21, 17, 5) },
]

/** Eco level thresholds, lowest first. */
export const ECO_LEVELS = [
  { min: 0, name: 'Green Sprout' },
  { min: 300, name: 'Green Contributor' },
  { min: 900, name: 'Eco Champion' },
  { min: 1800, name: 'Planet Guardian' },
]

export const ecoLevelFor = (score: number) =>
  [...ECO_LEVELS].reverse().find((l) => score >= l.min)?.name ?? ECO_LEVELS[0].name
