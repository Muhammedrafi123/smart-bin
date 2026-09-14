import { motion } from 'framer-motion'
import { AlertTriangle, IndianRupee, Lightbulb, ShieldCheck } from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { ScreenBody } from '@/components/layout/PhoneShell'
import { Card, SectionTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/States'
import { PenaltyCard } from '@/components/domain/PenaltyCard'
import { useApp } from '@/store/appContext'
import { PENALTY_TIPS } from '@/data/penalties'
import { inr } from '@/lib/format'

export default function Penalties() {
  const { penalties, stats } = useApp()

  return (
    <>
      <StatusBar />
      <ScreenHeader title="Penalties" subtitle="Fines and flagged deposits" back="/home" />

      <ScreenBody className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 grid grid-cols-2 gap-2.5"
        >
          <div className="rounded-xl2 border border-danger-100 bg-danger-50 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-danger-600">
              <IndianRupee size={17} />
            </span>
            <p className="mt-3 text-[24px] font-extrabold leading-none tracking-tight text-danger-600 tabular">
              {inr(stats.fineAmount)}
            </p>
            <p className="mt-1.5 text-[11.5px] font-medium text-ink-500">Total fine</p>
          </div>

          <div className="rounded-xl2 border border-ink-200/70 bg-white p-4 shadow-soft">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warn-100 text-warn-600">
              <AlertTriangle size={17} />
            </span>
            <p className="mt-3 text-[24px] font-extrabold leading-none tracking-tight text-ink-900 tabular">
              {stats.penaltyPoints}
            </p>
            <p className="mt-1.5 text-[11.5px] font-medium text-ink-500">Penalty points</p>
          </div>
        </motion.div>

        <div className="mt-3.5 flex items-start gap-2.5 rounded-xl2 bg-brand-50 px-4 py-3.5">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-600" />
          <p className="text-[12px] leading-relaxed text-ink-700">
            Penalties are here to teach, not to punish. Points reset after 30 days of clean deposits, and
            fines are settled at the campus office.
          </p>
        </div>

        <div className="mt-6">
          <SectionTitle>Penalty History</SectionTitle>
          {penalties.length ? (
            <div className="space-y-2.5">
              {penalties.map((tx) => (
                <PenaltyCard key={tx.id} tx={tx} />
              ))}
            </div>
          ) : (
            <Card padded={false}>
              <EmptyState
                icon={<ShieldCheck size={26} />}
                title="No penalties. Nice."
                body="Every deposit you have made was sorted correctly. Keep it going."
              />
            </Card>
          )}
        </div>

        <div className="mt-6">
          <SectionTitle>How to avoid penalties</SectionTitle>
          <div className="space-y-2.5">
            {PENALTY_TIPS.map((tip, i) => (
              <div
                key={tip.title}
                className="flex items-start gap-3 rounded-xl2 border border-ink-200/70 bg-white p-3.5 shadow-soft"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warn-100 text-[12px] font-extrabold text-warn-600">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[12.5px] font-bold text-ink-900">{tip.title}</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl2 border border-dashed border-brand-200 bg-brand-50/60 px-4 py-3.5">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-brand-600" />
          <p className="text-[11.5px] leading-relaxed text-ink-700">
            <span className="font-bold">Help &amp; guidelines.</span> Learn how to dispose waste correctly
            and keep your eco score climbing.
          </p>
        </div>
      </ScreenBody>
    </>
  )
}
