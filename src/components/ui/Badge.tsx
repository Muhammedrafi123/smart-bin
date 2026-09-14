import type { ReactNode } from 'react'
import type { DepositStatus } from '@/types'

type Tone = 'success' | 'danger' | 'warn' | 'neutral' | 'info'

const TONES: Record<Tone, string> = {
  success: 'bg-brand-100 text-brand-700',
  danger: 'bg-danger-100 text-danger-600',
  warn: 'bg-warn-100 text-warn-600',
  neutral: 'bg-ink-100 text-ink-500',
  info: 'bg-info-100 text-info-600',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}

const STATUS_LABEL: Record<DepositStatus, { label: string; tone: Tone }> = {
  accepted: { label: 'Accepted', tone: 'success' },
  incorrect: { label: 'Incorrect', tone: 'danger' },
  rejected: { label: 'Rejected', tone: 'danger' },
}

export function StatusBadge({ status }: { status: DepositStatus }) {
  const s = STATUS_LABEL[status]
  return <Badge tone={s.tone}>{s.label}</Badge>
}
