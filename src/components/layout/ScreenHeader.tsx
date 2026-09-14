import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface Props {
  title: string
  subtitle?: string
  action?: ReactNode
  /** Route to go back to; falls back to browser history. */
  back?: string
  showBack?: boolean
}

export function ScreenHeader({ title, subtitle, action, back, showBack = true }: Props) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-ink-200/60 bg-white/85 px-4 py-3 backdrop-blur-xl">
      {showBack ? (
        <button
          onClick={() => (back ? navigate(back) : navigate(-1))}
          aria-label="Go back"
          className="-ml-1.5 rounded-full p-2 text-ink-700 transition-colors hover:bg-ink-100 active:scale-95"
        >
          <ChevronLeft size={21} />
        </button>
      ) : (
        <div className="w-2" />
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[16px] font-bold tracking-tight text-ink-900">{title}</h1>
        {subtitle && <p className="truncate text-[11.5px] text-ink-400">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
