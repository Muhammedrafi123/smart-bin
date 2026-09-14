import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
  interactive?: boolean
}

export function Card({ children, padded = true, interactive = false, className = '', ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`rounded-xl2 border border-ink-200/70 bg-white shadow-soft ${padded ? 'p-4' : ''} ${
        interactive
          ? 'cursor-pointer transition-all duration-150 active:scale-[.99] hover:border-brand-200'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[15px] font-bold tracking-tight text-ink-900">{children}</h2>
      {action}
    </div>
  )
}
