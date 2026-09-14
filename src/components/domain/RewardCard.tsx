import { Award, Backpack, GlassWater, Ticket, TreeDeciduous } from 'lucide-react'
import type { Reward } from '@/types'
import { Button } from '@/components/ui/Button'

const ICON = {
  badge: Award,
  coupon: Ticket,
  tree: TreeDeciduous,
  bottle: GlassWater,
  kit: Backpack,
} as const

export function RewardCard({
  reward,
  balance,
  onRedeem,
}: {
  reward: Reward
  balance: number
  onRedeem: (r: Reward) => void
}) {
  const Icon = ICON[reward.icon]
  const affordable = balance >= reward.cost
  const progress = Math.min(100, Math.round((balance / reward.cost) * 100))

  return (
    <div className="flex w-[9.5rem] shrink-0 flex-col rounded-xl2 border border-ink-200/70 bg-white p-3.5 shadow-soft">
      <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon size={21} strokeWidth={2} />
      </div>
      <h3 className="text-[13px] font-bold leading-tight text-ink-900">{reward.name}</h3>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-400">{reward.description}</p>

      <div className="mt-2.5 text-[12px] font-bold text-brand-700 tabular">{reward.cost} pts</div>

      {!affordable && (
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-brand-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="mt-3">
        <Button
          size="sm"
          variant={affordable ? 'primary' : 'outline'}
          disabled={!affordable}
          onClick={() => onRedeem(reward)}
        >
          {affordable ? 'Redeem' : `${reward.cost - balance} more`}
        </Button>
      </div>
    </div>
  )
}
