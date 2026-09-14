import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Leaf,
  LogOut,
  Mail,
  Pencil,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Weight,
} from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenBody } from '@/components/layout/PhoneShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, SectionTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useApp } from '@/store/appContext'
import { useToast } from '@/store/toastContext'
import { inr, longDate } from '@/lib/format'

export default function Profile() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, stats, signOut, resetDemo, unreadCount } = useApp()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')

  if (!user) return null

  function logout() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <StatusBar />

      <ScreenBody>
        <div className="relative bg-[linear-gradient(180deg,#F0FAF4_0%,#FFFFFF_100%)] px-5 pb-5 pt-3">
          <div className="flex items-center justify-between">
            <h1 className="text-[17px] font-extrabold tracking-tight text-ink-900">My Profile</h1>
            <button
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
              className="relative rounded-full border border-ink-200/70 bg-white p-2 text-ink-700 shadow-soft"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-danger-500 ring-2 ring-white" />
              )}
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-center gap-4"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt=""
                className="h-[68px] w-[68px] rounded-2xl object-cover ring-2 ring-white"
              />
              <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-white">
                <Leaf size={12} />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[19px] font-extrabold tracking-tight text-ink-900">
                {user.name}
              </h2>
              <p className="mt-0.5 text-[12.5px] font-medium text-ink-500">{user.id}</p>
              <p className="text-[12px] text-ink-400">{user.department}</p>
            </div>

            <button
              onClick={() => setEditing(true)}
              aria-label="Edit profile"
              className="rounded-full border border-ink-200 bg-white p-2 text-ink-700 shadow-soft transition-transform active:scale-95"
            >
              <Pencil size={15} />
            </button>
          </motion.div>
        </div>

        <div className="px-5">
          <div className="grid grid-cols-4 gap-2">
            <Metric icon={Leaf} value={String(stats.ecoScore)} label="Eco Score" tone="brand" />
            <Metric
              icon={Weight}
              value={`${stats.totalWasteKg.toFixed(1)}kg`}
              label="Waste"
              tone="neutral"
            />
            <Metric icon={Trophy} value={String(stats.points)} label="Points" tone="warn" />
            <Metric icon={AlertTriangle} value={inr(stats.fineAmount)} label="Penalty" tone="danger" />
          </div>

          <div className="mt-6">
            <SectionTitle>Account Information</SectionTitle>
            <Card padded={false} className="divide-y divide-ink-100 px-4">
              <InfoRow icon={CreditCard} label="RFID Card" value={user.rfidCard} />
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Building2} label="Department" value={user.department} />
              <InfoRow icon={CalendarDays} label="Joined On" value={longDate(user.joinedAt)} />
              <InfoRow icon={ShieldCheck} label="Status" value={<Badge tone="success">Active</Badge>} />
            </Card>
          </div>

          <div className="mt-6">
            <SectionTitle>More</SectionTitle>
            <Card padded={false} className="divide-y divide-ink-100 px-4">
              <LinkRow
                icon={AlertTriangle}
                label="Penalties & Fines"
                onClick={() => navigate('/penalties')}
              />
              <LinkRow icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />
              <LinkRow
                icon={CircleHelp}
                label="Help & Support"
                onClick={() => toast('Reach the green cell at help@campus.edu', 'info')}
              />
              <LinkRow
                icon={RotateCcw}
                label="Reset demo data"
                onClick={() => {
                  resetDemo()
                  toast('Demo data restored to its starting state.')
                }}
              />
            </Card>
          </div>

          <div className="mt-5">
            <Button
              variant="outline"
              icon={<LogOut size={17} />}
              className="!text-danger-600"
              onClick={() => setConfirmLogout(true)}
            >
              Logout
            </Button>
          </div>

          <p className="mt-6 text-center text-[11px] text-ink-400">
            ENGO v1.0 · Small Actions. A Cleaner Tomorrow.
          </p>
        </div>
      </ScreenBody>

      <BottomNav />

      <Modal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Log out?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmLogout(false)}>
              Stay
            </Button>
            <Button variant="danger" onClick={logout}>
              Log out
            </Button>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-ink-500">
          Your deposits and points stay saved on this device. You can log back in with your User ID or RFID
          card.
        </p>
      </Modal>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit profile"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setEditing(false)
                toast('Profile changes need administrator approval.', 'info')
              }}
            >
              Request change
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="text-[11px] font-semibold tracking-wide text-ink-400">Display name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-ink-200 px-4 py-3 text-[14px] font-semibold text-ink-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </label>
        <p className="mt-3 text-[11.5px] leading-relaxed text-ink-400">
          Your User ID, department and RFID card are managed by the campus administrator.
        </p>
      </Modal>
    </>
  )
}

function Metric({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Leaf
  value: string
  label: string
  tone: 'brand' | 'neutral' | 'warn' | 'danger'
}) {
  const TONES = {
    brand: 'bg-brand-50 text-brand-600',
    neutral: 'bg-ink-100 text-ink-500',
    warn: 'bg-warn-100 text-warn-600',
    danger: 'bg-danger-50 text-danger-600',
  } as const

  return (
    <div className="rounded-xl2 border border-ink-200/70 bg-white px-2 py-3 text-center shadow-soft">
      <div className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${TONES[tone]}`}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <div className="text-[13px] font-extrabold tracking-tight text-ink-900 tabular">{value}</div>
      <div className="mt-0.5 text-[9.5px] font-medium text-ink-400">{label}</div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Leaf
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <Icon size={16} className="shrink-0 text-ink-400" />
      <span className="flex-1 text-[12.5px] text-ink-500">{label}</span>
      <span className="text-[12.5px] font-semibold text-ink-900">{value}</span>
    </div>
  )
}

function LinkRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Leaf
  label: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 py-3.5 text-left">
      <Icon size={16} className="shrink-0 text-ink-400" />
      <span className="flex-1 text-[12.5px] font-medium text-ink-900">{label}</span>
      <ChevronRight size={16} className="text-ink-200" />
    </button>
  )
}
