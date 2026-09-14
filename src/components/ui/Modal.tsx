import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  dismissible?: boolean
}

export function Modal({ open, onClose, title, children, footer, dismissible = true }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink-900/45 backdrop-blur-[2px]"
            onClick={dismissible ? onClose : undefined}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="relative w-full rounded-t-xl3 bg-white px-5 pb-7 pt-3 shadow-lift"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink-200" />
            {title && (
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold tracking-tight text-ink-900">{title}</h3>
                {dismissible && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="-mr-1 -mt-1 rounded-full p-1.5 text-ink-400 transition-colors hover:bg-ink-100"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            {children}
            {footer && <div className="mt-5 flex gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
