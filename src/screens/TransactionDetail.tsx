import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Check, MapPin, Recycle, Share2 } from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { ScreenBody } from '@/components/layout/PhoneShell'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { StatusBadge } from '@/components/ui/Badge'
import { useApp } from '@/store/appContext'
import { useToast } from '@/store/toastContext'
import { SMART_BINS } from '@/data/bins'
import { WASTE_META } from '@/lib/waste'
import { inr, kg, longDate, time } from '@/lib/format'

export default function TransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { transactions, user } = useApp()

  const tx = transactions.find((t) => t.id === id)

  if (!tx) {
    return (
      <>
        <StatusBar />
        <ScreenHeader title="Transaction" back="/history" />
        <ScreenBody>
          <EmptyState
            icon={<Recycle size={26} />}
            title="Transaction not found"
            body="This record is no longer available in your history."
            action={
              <Button size="sm" onClick={() => navigate('/history')}>
                Back to history
              </Button>
            }
          />
        </ScreenBody>
      </>
    )
  }

  const ok = tx.status === 'accepted'
  const meta = WASTE_META[tx.wasteType]
  const bin = SMART_BINS.find((b) => b.id === tx.binId)

  return (
    <>
      <StatusBar />
      <ScreenHeader
        title="Transaction Details"
        subtitle={tx.id}
        back="/history"
        action={
          <button
            onClick={() => toast('Receipt copied to your clipboard.', 'info')}
            aria-label="Share receipt"
            className="rounded-full p-2 text-ink-500 transition-colors hover:bg-ink-100"
          >
            <Share2 size={18} />
          </button>
        }
      />

      <ScreenBody className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 overflow-hidden rounded-xl3 border border-ink-200/70 bg-white shadow-soft"
        >
          <div
            className={`flex flex-col items-center px-5 py-6 ${
              ok
                ? 'bg-[linear-gradient(180deg,#F0FAF4_0%,#FFFFFF_100%)]'
                : 'bg-[linear-gradient(180deg,#FEF5F4_0%,#FFFFFF_100%)]'
            }`}
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full text-white ${
                ok ? 'bg-brand-600' : 'bg-danger-600'
              }`}
            >
              {ok ? <Check size={30} strokeWidth={3} /> : <AlertTriangle size={27} strokeWidth={2.4} />}
            </div>

            <p
              className={`mt-4 text-[30px] font-extrabold leading-none tracking-tight tabular ${
                ok ? 'text-brand-700' : 'text-danger-600'
              }`}
            >
              {tx.points > 0 ? '+' : ''}
              {tx.points}
              <span className="ml-1 text-[15px] font-bold">pts</span>
            </p>

            <p className="mt-2 text-[13px] font-semibold text-ink-900">{meta.label} waste</p>
            <div className="mt-2.5">
              <StatusBadge status={tx.status} />
            </div>
          </div>

          <div className="divide-y divide-ink-100 px-5 pb-1">
            <Row label="Transaction ID" value={tx.id} />
            <Row label="Date" value={longDate(tx.timestamp)} />
            <Row label="Time" value={time(tx.timestamp)} />
            <Row label="User" value={user?.name ?? tx.userId} />
            <Row label="Waste Type" value={meta.label} />
            <Row label="Weight" value={kg(tx.weightKg)} />
            <Row label="AI Confidence" value={`${tx.confidence}%`} />
            <Row label="Fine" value={tx.fine > 0 ? inr(tx.fine) : 'None'} danger={tx.fine > 0} />
          </div>
        </motion.div>

        {tx.reason && (
          <div className="mt-3.5 flex items-start gap-2.5 rounded-xl2 bg-danger-50 px-4 py-3.5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger-600" />
            <div>
              <p className="text-[12.5px] font-bold text-danger-600">Why this was flagged</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-700">{tx.reason}</p>
            </div>
          </div>
        )}

        {bin && (
          <div className="mt-3.5 flex items-center gap-3 rounded-xl2 border border-ink-200/70 bg-white p-4 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <MapPin size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-ink-900">{bin.label}</p>
              <p className="truncate text-[11.5px] text-ink-400">{bin.location}</p>
            </div>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[10.5px] font-semibold text-ink-500">
              {bin.id}
            </span>
          </div>
        )}

        <div className="mt-5">
          <Button variant="outline" icon={<Recycle size={16} />} onClick={() => navigate('/deposit')}>
            Make another deposit
          </Button>
        </div>
      </ScreenBody>
    </>
  )
}

function Row({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[12.5px] text-ink-400">{label}</span>
      <span className={`text-[13px] font-semibold ${danger ? 'text-danger-600' : 'text-ink-900'}`}>
        {value}
      </span>
    </div>
  )
}
