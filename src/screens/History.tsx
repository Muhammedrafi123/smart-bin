import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Recycle, ScrollText } from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { ScreenBody } from '@/components/layout/PhoneShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { TransactionItem } from '@/components/domain/TransactionItem'
import { EmptyState } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/store/appContext'
import type { WasteType } from '@/types'
import { kg, shortDate } from '@/lib/format'

type Filter = 'all' | WasteType

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'organic', label: 'Organic' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'paper', label: 'Paper' },
  { value: 'metal', label: 'Metal' },
  { value: 'other', label: 'Other' },
]

export default function History() {
  const navigate = useNavigate()
  const { transactions } = useApp()
  const [filter, setFilter] = useState<Filter>('all')

  const rows = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((t) => t.wasteType === filter)),
    [transactions, filter],
  )

  /** Group by calendar day so long histories stay scannable. */
  const groups = useMemo(() => {
    const map = new Map<string, typeof rows>()
    for (const t of rows) {
      const key = new Date(t.timestamp).toDateString()
      const list = map.get(key) ?? []
      list.push(t)
      map.set(key, list)
    }
    return [...map.entries()]
  }, [rows])

  const totalWeight = rows.reduce((s, t) => s + t.weightKg, 0)
  const totalPoints = rows.reduce((s, t) => s + t.points, 0)

  return (
    <>
      <StatusBar />
      <ScreenHeader
        title="Waste History"
        subtitle={`${transactions.length} deposits recorded`}
        back="/home"
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-ink-200/60 bg-white px-5 py-3">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
              filter === f.value
                ? 'bg-brand-900 text-white'
                : 'border border-ink-200 bg-white text-ink-500 hover:bg-ink-100/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ScreenBody className="px-5">
        {rows.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Summary label="Total weight" value={kg(totalWeight)} />
            <Summary
              label="Net points"
              value={`${totalPoints > 0 ? '+' : ''}${totalPoints}`}
              tone={totalPoints >= 0 ? 'brand' : 'danger'}
            />
          </div>
        )}

        {groups.length ? (
          <div className="mt-5 space-y-5">
            {groups.map(([day, items], gi) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(gi * 0.04, 0.2) }}
              >
                <h2 className="mb-2 px-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-400">
                  {labelForDay(day)}
                </h2>
                <div className="space-y-2.5">
                  {items.map((tx) => (
                    <TransactionItem key={tx.id} tx={tx} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ScrollText size={26} />}
            title="Nothing here yet"
            body={
              filter === 'all'
                ? 'Deposits you make will appear here with weight, points and status.'
                : 'No deposits of this waste type yet. Try another filter.'
            }
            action={
              filter === 'all' ? (
                <Button size="sm" icon={<Recycle size={15} />} onClick={() => navigate('/deposit')}>
                  Deposit Waste
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setFilter('all')}>
                  Show all
                </Button>
              )
            }
          />
        )}
      </ScreenBody>

      <BottomNav />
    </>
  )
}

function labelForDay(day: string) {
  const d = new Date(day)
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 864e5).toDateString()
  if (day === today) return 'Today'
  if (day === yesterday) return 'Yesterday'
  return shortDate(d.toISOString())
}

function Summary({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: string
  tone?: 'neutral' | 'brand' | 'danger'
}) {
  const color = tone === 'brand' ? 'text-brand-700' : tone === 'danger' ? 'text-danger-600' : 'text-ink-900'
  return (
    <div className="rounded-xl2 border border-ink-200/70 bg-white px-4 py-3 shadow-soft">
      <p className="text-[11px] font-medium text-ink-400">{label}</p>
      <p className={`mt-0.5 text-[17px] font-extrabold tracking-tight tabular ${color}`}>{value}</p>
    </div>
  )
}
