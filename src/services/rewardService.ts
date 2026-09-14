import type { Redemption, Reward } from '@/types'
import { REWARD_CATALOGUE } from '@/data/rewards'
import { delay } from '@/lib/delay'

export const rewardService = {
  catalogue(): Reward[] {
    return REWARD_CATALOGUE
  },

  async redeem(
    reward: Reward,
    balance: number,
  ): Promise<{ ok: boolean; redemption?: Redemption; error?: string }> {
    await delay(700)
    if (balance < reward.cost) {
      return { ok: false, error: `You need ${reward.cost - balance} more points for ${reward.name}.` }
    }
    return {
      ok: true,
      redemption: {
        id: `RD-${Math.floor(2100 + Math.random() * 800)}`,
        rewardId: reward.id,
        rewardName: reward.name,
        points: reward.cost,
        timestamp: new Date().toISOString(),
      },
    }
  },
}
