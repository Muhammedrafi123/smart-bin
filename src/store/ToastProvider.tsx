import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { ToastCtx } from './toastContext'
import type { ToastKind } from './toastContext'

interface Toast {
  id: number
  kind: ToastKind
  message: string
}

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
} as const

const TONES = {
  success: 'bg-brand-900 text-white',
  error: 'bg-danger-600 text-white',
  info: 'bg-ink-900 text-white',
} as const

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = nextId++
    setToasts((t) => [...t, { id, kind, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 pt-14">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.kind]
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className={`flex w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-[13px] font-medium shadow-lift ${TONES[t.kind]}`}
              >
                <Icon size={17} className="shrink-0" />
                <span className="leading-snug">{t.message}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}
