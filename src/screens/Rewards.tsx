import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Leaf, Sparkles, Trophy } from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { ScreenBody } from '@/components/layout/PhoneShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, SectionTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/States'
import { ProgressBar } from '@/components/ui/ProgressRing'
import { RewardCard } from '@/components/domain/RewardCard'
import { useApp } from '@/store/appContext'
import { useToast } from '@/store/toastContext'
import { rewardService } from '@/services/rewardService'
import { notificationService } from '@/services/notificationService'
import { ECO_LEVELS } from '@/data/rewards'
import type { Reward } from '@/types'
import { stamp } from '@/lib/format'

type Tab = 'rewards' | 'history'

export default function Rewards() {
  const { stats, redemptions, addRedemption, pushNotifications } = useApp()
  const toast = useToast()

  const [tab, setTab] = useState<Tab>('rewards')
  const [pending, setPending] = useState<Reward | null>(null)
  const [busy, setBusy] = useState(false)

  const catalogue = rewardService.catalogue()
  const nextLevel = ECO_LEVELS.find((l) => l.min > stats.ecoScore)

  async function confirmRedeem() {
    if (!pending) return
    setBusy(true)
    const res = await rewardService.redeem(pending, stats.points)
    setBusy(false)

    if (!res.ok || !res.redemption) {
      setPending(null)
      return toast(res.error ?? 'Redemption failed.', 'error')
    }

    addRedemption(res.redemption)
    pushNotifications([notificationService.forRedemption(pending.name, pending.cost)])
    setPending(null)
    toast(`${pending.name} redeemed successfully`)
  }

  return (
    <>
      <StatusBar />
      <ScreenHeader title="Eco Rewards" subtitle={stats.ecoLevel} back="/home" />

      <ScreenBody className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-4 overflow-hidden rounded-xl3 bg-[linear-gradient(135deg,#0F3B2A_0%,#1C6A4A_60%,#248A5E_100%)] p-5 text-white shadow-lift"
        >
          <Leaf
            size={140}
            className="pointer-events-none absolute -right-6 -top-8 text-white/[.07]"
            strokeWidth={1}
          />
          <div className="relative">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-white/80">
              <Trophy size={15} /> Your Points
            </div>
            <p className="mt-2 text-[44px] font-extrabold leading-none tracking-tight tabular">
              {stats.points}
            </p>
            <p className="mt-2.5 text-[12px] text-white/70">
              {stats.ecoLevel}
              {nextLevel && ` · ${nextLevel.min - stats.ecoScore} eco score to ${nextLevel.name}`}
            </p>

            {nextLevel && (
              <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-brand-300 transition-[width] duration-700"
                  style={{ width: `${Math.min(100, (stats.ecoScore / nextLevel.min) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </motion.div>

        <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-ink-100 p-1">
          {(['rewards', 'history'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl py-2 text-[12.5px] font-semibold capitalize transition-colors ${
                tab === t ? 'bg-brand-900 text-white shadow-soft' : 'text-ink-500'
              }`}
            >
              {t === 'rewards' ? 'Rewards' : 'History'}
            </button>
          ))}
        </div>

        {tab === 'rewards' ? (
          <>
            <div className="mt-5">
              <SectionTitle>Redeem Rewards</SectionTitle>
              <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
                {catalogue.map((r) => (
                  <RewardCard key={r.id} reward={r} balance={stats.points} onRedeem={setPending} />
                ))}
              </div>
            </div>

            <Card className="mt-5 border-brand-100 bg-brand-50/70">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
                  <Sparkles size={17} />
                </span>
                <div>
                  <p className="text-[13px] font-bold text-ink-900">Small Actions. Bigger Impact.</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-500">
                    Redeem rewards and help create a greener campus. Every 20 points equals roughly 1 kg of
                    waste sorted correctly.
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-5">
              <SectionTitle>How points work</SectionTitle>
              <Card>
                <PointRule label="Correctly sorted waste" value="+20 pts / kg" tone="brand" />
                <div className="my-2.5 h-px bg-ink-100" />
                <PointRule label="Incorrect classification" value="-10 pts" tone="danger" />
                <div className="my-2.5 h-px bg-ink-100" />
                <PointRule label="Non-recyclable material" value="-20 pts" tone="danger" />
                <div className="mt-3">
                  <ProgressBar value={stats.points} max={500} />
                  <p className="mt-2 text-[11px] text-ink-400">
                    {Math.max(0, 500 - stats.points)} points to unlock Plant a Tree.
                  </p>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <div className="mt-5">
            <SectionTitle>Reward History</SectionTitle>
            {redemptions.length ? (
              <div className="space-y-2.5">
                {redemptions.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-xl2 border border-ink-200/70 bg-white p-3.5 shadow-soft"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Gift size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-ink-900">{r.rewardName}</p>
                      <p className="mt-0.5 text-[11.5px] text-ink-400">
                        {stamp(r.timestamp)} · {r.id}
                      </p>
                    </div>
                    <span className="text-[13px] font-bold text-danger-600 tabular">-{r.points}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl2 border border-ink-200/70 bg-white">
                <EmptyState
                  icon={<Gift size={26} />}
                  title="No rewards redeemed yet"
                  body="Redeem your first reward and it will show up here."
                  action={
                    <Button size="sm" variant="outline" onClick={() => setTab('rewards')}>
                      Browse rewards
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        )}
      </ScreenBody>

      <BottomNav />

      <Modal
        open={!!pending}
        onClose={() => !busy && setPending(null)}
        title="Confirm redemption"
        footer={
          <>
            <Button variant="outline" onClick={() => setPending(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={confirmRedeem} loading={busy}>
              Redeem
            </Button>
          </>
        }
      >
        {pending && (
          <div>
            <p className="text-[13px] leading-relaxed text-ink-500">
              Redeem <span className="font-bold text-ink-900">{pending.name}</span> for{' '}
              <span className="font-bold text-ink-900">{pending.cost} points</span>?
            </p>
            <div className="mt-3.5 flex items-center justify-between rounded-xl2 bg-ink-100/70 px-4 py-3">
              <span className="text-[12px] text-ink-500">Balance after redemption</span>
              <span className="text-[14px] font-extrabold text-ink-900 tabular">
                {stats.points - pending.cost} pts
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

function PointRule({ label, value, tone }: { label: string; value: string; tone: 'brand' | 'danger' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] text-ink-500">{label}</span>
      <span
        className={`text-[12.5px] font-bold tabular ${tone === 'brand' ? 'text-brand-700' : 'text-danger-600'}`}
      >
        {value}
      </span>
    </div>
  )
}
