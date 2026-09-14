import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Transaction } from '@/types'
import { WASTE_META } from '@/lib/waste'
import { kg, stamp } from '@/lib/format'
import { WasteIcon } from './WasteIcon'

export function TransactionItem({ tx, compact = false }: { tx: Transaction; compact?: boolean }) {
  const navigate = useNavigate()
  const positive = tx.points >= 0

  return (
    <button
      onClick={() => navigate(`/transaction/${tx.id}`)}
      className="flex w-full items-center gap-3 rounded-xl2 border border-ink-200/70 bg-white p-3 text-left transition-all duration-150 hover:border-brand-200 active:scale-[.99]"
    >
      <WasteIcon type={tx.wasteType} size={compact ? 38 : 42} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13.5px] font-bold text-ink-900">
            {WASTE_META[tx.wasteType].label}
          </span>
          {!positive && (
            <span className="shrink-0 rounded-full bg-danger-100 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-danger-600">
              {tx.status}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-ink-400">
          {kg(tx.weightKg)} · {stamp(tx.timestamp)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span
          className={`text-[13px] font-bold tabular ${positive ? 'text-brand-600' : 'text-danger-600'}`}
        >
          {positive ? '+' : ''}
          {tx.points}
        </span>
        <ChevronRight size={16} className="text-ink-200" />
      </div>
    </button>
  )
}
