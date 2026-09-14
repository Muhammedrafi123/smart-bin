import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  IndianRupee,
  Leaf,
  Recycle,
  ScanLine,
  TrendingUp,
  Trophy,
  Weight,
} from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenBody } from '@/components/layout/PhoneShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, SectionTitle } from '@/components/ui/Card'
import { StatTile } from '@/components/domain/StatTile'
import { TransactionItem } from '@/components/domain/TransactionItem'
import { EmptyState } from '@/components/ui/States'
import { useApp } from '@/store/appContext'
import { firstName, greeting, inr } from '@/lib/format'
import { ACTIVE_BIN } from '@/data/bins'

export default function Home() {
  const navigate = useNavigate()
  const { user, stats, transactions, unreadCount } = useApp()
  const recent = transactions.slice(0, 3)

  if (!user) return null

  return (
    <>
      <StatusBar />

      <ScreenBody className="px-5">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 pb-5 pt-1"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-medium text-ink-400">{greeting()},</p>
            <h1 className="truncate text-[23px] font-extrabold tracking-tight text-ink-900">
              {firstName(user.name)} <span className="inline-block">👋</span>
            </h1>
          </div>

          <button
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            className="relative rounded-full border border-ink-200/70 bg-white p-2.5 text-ink-700 shadow-soft transition-transform active:scale-95"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[9.5px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          <Link to="/profile" aria-label="Profile">
            <img
              src={user.avatar}
              alt=""
              className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-100"
            />
          </Link>
        </motion.header>

        {/* Eco score hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden rounded-xl3 bg-[linear-gradient(135deg,#0F3B2A_0%,#1C6A4A_58%,#248A5E_100%)] p-5 text-white shadow-lift"
        >
          <Leaf
            size={150}
            className="pointer-events-none absolute -right-8 -top-8 text-white/[.07]"
            strokeWidth={1}
          />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                <Leaf size={14} />
              </span>
              <span className="text-[12px] font-semibold text-white/80">Your Eco Score</span>
            </div>

            <div className="mt-2.5 flex items-end gap-3">
              <span className="text-[44px] font-extrabold leading-none tracking-tight tabular">
                {stats.ecoScore}
              </span>
              <span className="mb-1.5 flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px] font-semibold">
                <TrendingUp size={12} /> +12% this month
              </span>
            </div>

            <p className="mt-2.5 text-[12px] font-medium text-white/70">
              {stats.ecoLevel} · {stats.deposits} deposits
            </p>
          </div>
        </motion.div>

        {/* Stat row */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <StatTile
            icon={Weight}
            label="Total Waste"
            value={`${stats.totalWasteKg.toFixed(1)} kg`}
            tone="brand"
          />
          <StatTile icon={Trophy} label="Rewards" value={`${stats.points} pts`} tone="warn" />
          <StatTile icon={IndianRupee} label="Penalty" value={inr(stats.fineAmount)} tone="danger" />
        </div>

        {/* Primary action */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/deposit')}
          className="mt-3.5 flex w-full items-center gap-3.5 rounded-xl2 bg-brand-600 p-4 text-left text-white shadow-[0_14px_30px_-14px_rgba(36,138,94,.85)] transition-transform duration-150 active:scale-[.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/18">
            <Recycle size={22} />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-bold">Deposit Waste</span>
            <span className="block text-[11.5px] text-white/75">Tap to start a new deposit</span>
          </span>
          <ScanLine size={19} className="text-white/70" />
        </motion.button>

        {/* This month */}
        <Card className="mt-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11.5px] font-medium text-ink-400">This Month</p>
              <p className="mt-0.5 text-[19px] font-extrabold tracking-tight text-ink-900 tabular">
                {stats.monthWasteKg.toFixed(1)} kg
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11.5px] font-medium text-ink-400">Nearest bin</p>
              <p className="mt-0.5 flex items-center justify-end gap-1.5 text-[12.5px] font-semibold text-ink-900">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {ACTIVE_BIN.label}
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-[width] duration-700"
              style={{ width: `${Math.min(100, (stats.monthWasteKg / 10) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-ink-400">
            {Math.max(0, 10 - stats.monthWasteKg).toFixed(1)} kg to reach your 10 kg monthly goal.
          </p>
        </Card>

        {/* Recent activity */}
        <div className="mt-6">
          <SectionTitle
            action={
              <Link
                to="/history"
                className="flex items-center gap-0.5 text-[12px] font-semibold text-brand-700"
              >
                See All <ChevronRight size={14} />
              </Link>
            }
          >
            Recent Activity
          </SectionTitle>

          {recent.length ? (
            <div className="space-y-2.5">
              {recent.map((tx) => (
                <TransactionItem key={tx.id} tx={tx} compact />
              ))}
            </div>
          ) : (
            <Card padded={false}>
              <EmptyState
                icon={<Recycle size={26} />}
                title="No deposits yet"
                body="Your first deposit will show up here with the points you earned."
              />
            </Card>
          )}
        </div>
      </ScreenBody>

      <BottomNav />
    </>
  )
}
