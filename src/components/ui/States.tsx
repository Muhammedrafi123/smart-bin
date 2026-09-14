import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-8 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        {icon}
      </div>
      <h3 className="text-[15px] font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 max-w-[16rem] text-[13px] leading-relaxed text-ink-500">{body}</p>
      {action && <div className="mt-5 w-full max-w-[13rem]">{action}</div>}
    </div>
  )
}

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 size={18} className={`animate-spin text-brand-600 ${className}`} />
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-xl2 border border-ink-200/70 bg-white p-4">
      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-ink-100 ww-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="relative h-3 w-2/5 overflow-hidden rounded-full bg-ink-100 ww-shimmer" />
        <div className="relative h-2.5 w-3/5 overflow-hidden rounded-full bg-ink-100 ww-shimmer" />
      </div>
    </div>
  )
}
