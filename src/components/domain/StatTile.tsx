import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  label: string
  value: string
  tone?: 'brand' | 'neutral' | 'danger' | 'warn'
}

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  neutral: 'bg-ink-100 text-ink-500',
  danger: 'bg-danger-50 text-danger-600',
  warn: 'bg-warn-100 text-warn-600',
} as const

export function StatTile({ icon: Icon, label, value, tone = 'neutral' }: Props) {
  return (
    <div className="rounded-xl2 border border-ink-200/70 bg-white px-3 py-3.5 text-center shadow-soft">
      <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${TONES[tone]}`}>
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div className="text-[15px] font-extrabold tracking-tight text-ink-900 tabular">{value}</div>
      <div className="mt-0.5 text-[10.5px] font-medium text-ink-400">{label}</div>
    </div>
  )
}
