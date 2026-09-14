import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BellOff, CheckCircle2, Gift, Info, TriangleAlert } from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { ScreenBody } from '@/components/layout/PhoneShell'
import { EmptyState } from '@/components/ui/States'
import { useApp } from '@/store/appContext'
import type { NotificationKind } from '@/types'
import { relative } from '@/lib/format'

const STYLE: Record<NotificationKind, { icon: typeof Info; chip: string }> = {
  success: { icon: CheckCircle2, chip: 'bg-brand-100 text-brand-700' },
  reward: { icon: Gift, chip: 'bg-warn-100 text-warn-600' },
  warning: { icon: TriangleAlert, chip: 'bg-danger-100 text-danger-600' },
  info: { icon: Info, chip: 'bg-info-100 text-info-600' },
}

export default function Notifications() {
  const { notifications, markAllRead, unreadCount } = useApp()

  /* Opening the centre clears the badge, as a real app would. */
  useEffect(() => {
    const id = setTimeout(markAllRead, 900)
    return () => clearTimeout(id)
  }, [markAllRead])

  return (
    <>
      <StatusBar />
      <ScreenHeader
        title="Notifications"
        subtitle={unreadCount ? `${unreadCount} unread` : 'All caught up'}
        back="/home"
      />

      <ScreenBody className="px-5">
        {notifications.length ? (
          <div className="mt-4 space-y-2.5">
            {notifications.map((n, i) => {
              const s = STYLE[n.kind]
              const Icon = s.icon
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.24) }}
                  className={`flex items-start gap-3 rounded-xl2 border p-3.5 transition-colors ${
                    n.read ? 'border-ink-200/70 bg-white' : 'border-brand-100 bg-brand-50/50'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.chip}`}
                  >
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold leading-snug text-ink-900">{n.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-500">{n.body}</p>
                    <p className="mt-1.5 text-[10.5px] font-medium text-ink-400">{relative(n.timestamp)}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={<BellOff size={26} />}
            title="No notifications"
            body="Deposit updates, rewards and alerts from the smart bins will land here."
          />
        )}
      </ScreenBody>
    </>
  )
}
