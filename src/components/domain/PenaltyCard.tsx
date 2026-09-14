import type { Transaction } from '@/types'
import { inr, stamp } from '@/lib/format'
import { WASTE_META } from '@/lib/waste'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function PenaltyCard({ tx }: { tx: Transaction }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/transaction/${tx.id}`)}
      className="flex w-full items-start gap-3 rounded-xl2 border border-ink-200/70 bg-white p-3.5 text-left transition-all duration-150 hover:border-danger-100 active:scale-[.99]"
    >
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${'bg-danger-500'}`} />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-snug text-ink-900">
          {tx.reason ?? 'Incorrect deposit'}
        </p>
        <p className="mt-1 text-[11.5px] text-ink-400">
          {WASTE_META[tx.wasteType].label} · {stamp(tx.timestamp)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[13px] font-bold text-danger-600 tabular">{tx.points} pts</div>
        <div className="mt-0.5 text-[11.5px] font-semibold text-ink-400 tabular">{inr(tx.fine)}</div>
      </div>
      <ChevronRight size={16} className="mt-1 shrink-0 text-ink-200" />
    </button>
  )
}
