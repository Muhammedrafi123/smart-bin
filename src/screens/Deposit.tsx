import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Cpu,
  FileText,
  Gauge,
  KeyRound,
  Loader2,
  Nfc,
  PackageOpen,
  ScanEye,
  Sparkles,
  Unlock,
} from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { LeafConfetti } from '@/components/brand/Logo'
import { aiService } from '@/services/aiService'
import type { DemoScenario } from '@/services/aiService'
import { wasteService } from '@/services/wasteService'
import { notificationService } from '@/services/notificationService'
import { useApp } from '@/store/appContext'
import { useToast } from '@/store/toastContext'
import type { AIResult, Transaction } from '@/types'
import { WASTE_META } from '@/lib/waste'
import { ACTIVE_BIN } from '@/data/bins'
import { inr, kg, longDate, time } from '@/lib/format'

type Phase = 'idle' | 'identified' | 'unlocked' | 'weighing' | 'analyzing' | 'result'

const STEPS = [
  { key: 'identify', label: 'Identify' },
  { key: 'deposit', label: 'Deposit' },
  { key: 'analyze', label: 'Analyze' },
  { key: 'result', label: 'Result' },
] as const

const PHASE_STEP: Record<Phase, number> = {
  idle: 0,
  identified: 0,
  unlocked: 1,
  weighing: 1,
  analyzing: 2,
  result: 3,
}

export default function Deposit() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, scenario, setScenario, addTransaction, pushNotifications } = useApp()

  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<AIResult | null>(null)
  const [tx, setTx] = useState<Transaction | null>(null)
  const timers = useRef<number[]>([])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  /* Step 1 - RFID handshake, then the bin unlocks. */
  useEffect(() => {
    later(() => setPhase('identified'), 2200)
    later(() => setPhase('unlocked'), 3500)
  }, [later])

  /* Step 2 - lid sensor picks up the deposit. */
  useEffect(() => {
    if (phase !== 'unlocked') return
    later(() => setPhase('weighing'), 2600)
  }, [phase, later])

  /* Step 3 - load cell settles while the classifier runs. */
  useEffect(() => {
    if (phase !== 'weighing' || !user) return
    let alive = true
    const started = Date.now()

    aiService.classify(scenario).then((res) => {
      if (!alive) return
      const wait = Math.max(0, 1600 - (Date.now() - started))
      window.setTimeout(() => {
        if (!alive) return
        setResult(res)
        setPhase('analyzing')
      }, wait)
    })

    return () => {
      alive = false
    }
  }, [phase, scenario, user])

  /* Step 4 - commit the transaction once the checklist finishes. */
  const commit = useCallback(() => {
    if (!result || !user || tx) return
    const created = wasteService.createTransaction(result, user.id)
    setTx(created)
    addTransaction(created)
    pushNotifications(notificationService.forTransaction(created))
    setPhase('result')
  }, [result, user, tx, addTransaction, pushNotifications])

  function finish() {
    if (tx) {
      toast(
        tx.points >= 0
          ? `${tx.points} Eco Points added to your balance`
          : 'Deposit flagged. Check the details.',
        tx.points >= 0 ? 'success' : 'error',
      )
    }
    navigate('/home')
  }

  if (!user) return null

  return (
    <div className="flex h-full flex-col bg-white">
      <StatusBar />
      <ScreenHeader
        title="Deposit Waste"
        subtitle={`${ACTIVE_BIN.label} - ${ACTIVE_BIN.location}`}
        back="/home"
        showBack={phase !== 'result'}
      />

      <Stepper active={PHASE_STEP[phase]} />

      <div className="screen-scroll no-scrollbar relative flex-1">
        {(phase === 'idle' || phase === 'identified') && (
          <Step key="scan">
            <ScanStep
              identified={phase === 'identified'}
              userName={user.name}
              scenario={scenario}
              onScenario={setScenario}
              onManual={() => setPhase('identified')}
              onCancel={() => navigate('/home')}
            />
          </Step>
        )}

        {phase === 'unlocked' && (
          <Step key="unlocked">
            <UnlockedStep />
          </Step>
        )}

        {phase === 'weighing' && (
          <Step key="weighing">
            <WeighingStep />
          </Step>
        )}

        {phase === 'analyzing' && result && (
          <Step key="analyzing">
            <AnalyzingStep result={result} onDone={commit} />
          </Step>
        )}

        {phase === 'result' && tx && (
          <Step key="result">
            <ResultStep tx={tx} onDone={finish} onDetails={() => navigate(`/transaction/${tx.id}`)} />
          </Step>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

/** Enter-only, for the same reason as the route transition in App.tsx. */
function Step({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex min-h-full flex-col px-5 pb-7 pt-5"
    >
      {children}
    </motion.div>
  )
}

function Stepper({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-ink-200/60 bg-white px-5 py-3">
      {STEPS.map((s, i) => {
        const done = i < active
        const current = i === active
        return (
          <div key={s.key} className="flex-1">
            <div
              className={`h-1 w-full rounded-full transition-colors duration-500 ${
                done || current ? 'bg-brand-500' : 'bg-ink-100'
              }`}
            />
            <span
              className={`mt-1.5 block text-[10px] font-semibold transition-colors ${
                current ? 'text-brand-700' : done ? 'text-ink-500' : 'text-ink-200'
              }`}
            >
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Step 1 - RFID ---------- */

function ScanStep({
  identified,
  userName,
  scenario,
  onScenario,
  onManual,
  onCancel,
}: {
  identified: boolean
  userName: string
  scenario: DemoScenario
  onScenario: (s: DemoScenario) => void
  onManual: () => void
  onCancel: () => void
}) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl3 bg-brand-50/70 px-6 py-9">
        <div className="relative flex h-32 w-32 items-center justify-center">
          {!identified && (
            <>
              <span className="ww-ping absolute inset-0 rounded-full bg-brand-200/70" />
              <span
                className="ww-ping absolute inset-0 rounded-full bg-brand-200/70"
                style={{ animationDelay: '.6s' }}
              />
            </>
          )}
          <motion.div
            animate={identified ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.45 }}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full ${
              identified ? 'bg-brand-600 text-white' : 'bg-white text-brand-600 shadow-soft'
            }`}
          >
            {identified ? <Check size={38} strokeWidth={3} /> : <Nfc size={40} strokeWidth={1.7} />}
          </motion.div>
        </div>

        <h2 className="mt-7 text-center text-[20px] font-extrabold tracking-tight text-ink-900">
          {identified ? 'RFID detected' : 'Tap Your RFID Card'}
        </h2>
        <p className="mt-2 max-w-[15rem] text-center text-[13px] leading-relaxed text-ink-500">
          {identified
            ? `${userName} identified. Unlocking the bin...`
            : 'Hold your card near the reader to identify yourself.'}
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11.5px] font-semibold text-ink-500 shadow-soft">
          {identified ? (
            <Check size={13} className="text-brand-600" />
          ) : (
            <Loader2 size={13} className="animate-spin text-brand-600" />
          )}
          {identified ? 'Card 8291 verified' : 'Waiting for card...'}
        </div>
      </div>

      <BinSimulator scenario={scenario} onScenario={onScenario} disabled={identified} />

      <div className="mt-3 space-y-2.5">
        <Button variant="outline" icon={<KeyRound size={17} />} onClick={onManual} disabled={identified}>
          Or enter manually
        </Button>
        <Button variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </>
  )
}

/** Stands in for the ESP32 and its sensors until the hardware is wired up. */
function BinSimulator({
  scenario,
  onScenario,
  disabled,
}: {
  scenario: DemoScenario
  onScenario: (s: DemoScenario) => void
  disabled: boolean
}) {
  const OPTIONS: { value: DemoScenario; label: string }[] = [
    { value: 'auto', label: 'Auto' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'incorrect', label: 'Incorrect' },
    { value: 'rejected', label: 'Rejected' },
  ]

  return (
    <div
      className={`mt-4 rounded-xl2 border border-dashed border-ink-200 bg-ink-100/40 p-3.5 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Cpu size={14} className="text-ink-400" />
        <span className="text-[11.5px] font-bold text-ink-700">Smart Bin Simulator</span>
        <span className="ml-auto flex items-center gap-1 text-[10.5px] font-semibold text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {ACTIVE_BIN.id} online
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-ink-400">
        Sensor output is simulated until the ESP32 hardware is connected.
      </p>
      <div className="mt-2.5 grid grid-cols-4 gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            disabled={disabled}
            onClick={() => onScenario(o.value)}
            className={`rounded-lg px-2 py-1.5 text-[10.5px] font-semibold transition-colors ${
              scenario === o.value ? 'bg-brand-900 text-white' : 'bg-white text-ink-500 hover:bg-white/70'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Step 2 - bin unlocked ---------- */

function UnlockedStep() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"
      >
        <Unlock size={34} strokeWidth={2} />
      </motion.div>

      <h2 className="mt-6 text-[21px] font-extrabold tracking-tight text-ink-900">Smart bin unlocked</h2>
      <p className="mt-2 max-w-[16rem] text-[13px] leading-relaxed text-ink-500">
        Place your waste inside the bin. The lid closes automatically once the sensor settles.
      </p>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-10 flex h-32 w-32 items-center justify-center rounded-xl3 bg-brand-50 text-brand-500"
      >
        <PackageOpen size={56} strokeWidth={1.5} />
      </motion.div>

      <div className="mt-10 flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2 text-[11.5px] font-semibold text-ink-500">
        <Loader2 size={13} className="animate-spin" />
        Waiting for the lid sensor...
      </div>
    </div>
  )
}

/* ---------- Step 3a - weighing ---------- */

function WeighingStep() {
  const [reading, setReading] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setReading(Math.random() * 1.4), 110)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
        <Gauge size={30} strokeWidth={2} />
      </div>

      <h2 className="mt-6 text-[21px] font-extrabold tracking-tight text-ink-900">Waste detected</h2>
      <p className="mt-2 text-[13px] text-ink-500">Measuring weight on the load cell...</p>

      <div className="mt-9 rounded-xl3 bg-ink-900 px-10 py-7 text-white">
        <div className="text-[42px] font-extrabold leading-none tracking-tight tabular">
          {reading.toFixed(2)}
          <span className="ml-1.5 text-[18px] font-semibold text-white/50">kg</span>
        </div>
        <p className="mt-2.5 text-[10.5px] font-semibold tracking-widest text-white/40">STABILISING</p>
      </div>

      <div className="mt-9 flex items-center gap-2 text-[11.5px] font-semibold text-ink-400">
        <Loader2 size={13} className="animate-spin text-brand-600" />
        Reading sensor data from {ACTIVE_BIN.id}
      </div>
    </div>
  )
}

/* ---------- Step 3b - AI analysis ---------- */

const CHECKS = [
  { key: 'image', label: 'Image Analysis', icon: ScanEye },
  { key: 'material', label: 'Material Detection', icon: Sparkles },
  { key: 'weight', label: 'Weight Measurement', icon: Gauge },
  { key: 'class', label: 'Classification', icon: Cpu },
] as const

function AnalyzingStep({ result, onDone }: { result: AIResult; onDone: () => void }) {
  const [step, setStep] = useState(0)
  const RADIUS = 88
  const CIRC = 2 * Math.PI * RADIUS

  useEffect(() => {
    const timers = CHECKS.map((_, i) => window.setTimeout(() => setStep(i + 1), 600 + i * 620))
    const finish = window.setTimeout(onDone, 600 + CHECKS.length * 620 + 500)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finish)
    }
  }, [onDone])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center pt-1">
        <div className="relative">
          <svg width="182" height="182" viewBox="0 0 182 182" className="-rotate-90">
            <circle
              cx="91"
              cy="91"
              r={RADIUS}
              fill="none"
              stroke="var(--color-brand-100)"
              strokeWidth="5"
            />
            <motion.circle
              cx="91"
              cy="91"
              r={RADIUS}
              fill="none"
              stroke="var(--color-brand-500)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: CIRC * (1 - step / CHECKS.length) }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center p-3.5">
            <img
              src={WASTE_META[result.imageKey].image}
              alt="Captured waste"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>

        <h2 className="mt-5 text-[21px] font-extrabold tracking-tight text-ink-900">Analyzing...</h2>
        <p className="mt-1.5 max-w-[16rem] text-center text-[13px] leading-relaxed text-ink-500">
          Our AI is identifying the waste type. Please wait a few seconds.
        </p>
      </div>

      <div className="mt-6 space-y-2">
        {CHECKS.map((c, i) => {
          const done = i < step
          const active = i === step
          return (
            <div
              key={c.key}
              className={`flex items-center gap-3 rounded-xl2 border px-3.5 py-3 transition-colors duration-300 ${
                done
                  ? 'border-brand-100 bg-brand-50/60'
                  : active
                    ? 'border-ink-200 bg-white'
                    : 'border-ink-100 bg-white opacity-55'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  done
                    ? 'bg-brand-600 text-white'
                    : active
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-ink-100 text-ink-200'
                }`}
              >
                {done ? (
                  <Check size={14} strokeWidth={3.2} />
                ) : active ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <c.icon size={13} />
                )}
              </span>
              <span
                className={`text-[13px] font-semibold ${done || active ? 'text-ink-900' : 'text-ink-400'}`}
              >
                {c.label}
              </span>
              {active && (
                <span className="ml-auto text-[11px] font-semibold text-brand-700">Processing</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl2 bg-brand-50 px-4 py-3">
        <Sparkles size={15} className="shrink-0 text-brand-600" />
        <p className="text-[11.5px] leading-relaxed text-ink-700">This usually takes a few seconds.</p>
      </div>
    </div>
  )
}

/* ---------- Step 4 - result ---------- */

function ResultStep({
  tx,
  onDone,
  onDetails,
}: {
  tx: Transaction
  onDone: () => void
  onDetails: () => void
}) {
  const ok = tx.status === 'accepted'
  const meta = WASTE_META[tx.wasteType]

  return (
    <div className="relative flex flex-1 flex-col">
      {ok && <LeafConfetti count={8} />}

      <div className="relative flex flex-col items-center pt-3">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className={`flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lift ${
            ok ? 'bg-brand-600' : 'bg-danger-600'
          }`}
        >
          {ok ? <Check size={44} strokeWidth={3} /> : <AlertTriangle size={40} strokeWidth={2.4} />}
        </motion.div>

        <h2 className="mt-5 text-center text-[23px] font-extrabold tracking-tight text-ink-900">
          {meta.label} Waste
        </h2>
        <p className="mt-1.5 max-w-[17rem] text-center text-[13px] leading-relaxed text-ink-500">
          {ok
            ? 'Nice work. You are making a real difference.'
            : (tx.reason ?? 'This deposit could not be accepted.')}
        </p>

        <div className="mt-3.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold ${
              ok ? 'bg-brand-100 text-brand-700' : 'bg-danger-100 text-danger-600'
            }`}
          >
            {ok ? <Check size={13} strokeWidth={3} /> : <AlertTriangle size={13} />}
            {ok ? 'Accepted' : tx.status === 'rejected' ? 'Rejected' : 'Incorrect'}
          </span>
        </div>
      </div>

      <div className="mt-5 divide-y divide-ink-100 rounded-xl2 border border-ink-200/70 bg-white px-4 shadow-soft">
        <Row label="Transaction ID" value={tx.id} mono />
        <Row label="Date & Time" value={`${longDate(tx.timestamp)}, ${time(tx.timestamp)}`} />
        <Row label="Waste Type" value={meta.label} accent={ok ? 'brand' : 'danger'} />
        <Row label="Deposited Weight" value={kg(tx.weightKg)} />
        <Row label="AI Confidence" value={`${tx.confidence}%`} />
        {tx.fine > 0 && <Row label="Fine Applied" value={inr(tx.fine)} accent="danger" />}
        <Row
          label={ok ? 'Reward Earned' : 'Penalty Applied'}
          value={`${tx.points > 0 ? '+' : ''}${tx.points} points`}
          accent={ok ? 'brand' : 'danger'}
          bold
        />
      </div>

      {!ok && (
        <div className="mt-3.5 flex items-start gap-2.5 rounded-xl2 bg-warn-100/70 px-4 py-3">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-warn-600" />
          <p className="text-[11.5px] leading-relaxed text-ink-700">
            Sort waste by the bin label to avoid penalties. Penalty points reset after 30 days of clean
            deposits.
          </p>
        </div>
      )}

      <div className="mt-auto space-y-2.5 pt-6">
        <Button onClick={onDone} iconRight={<ArrowRight size={18} />}>
          Done
        </Button>
        <Button variant="outline" icon={<FileText size={16} />} onClick={onDetails}>
          View Details
        </Button>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  accent,
  bold,
  mono,
}: {
  label: string
  value: string
  accent?: 'brand' | 'danger'
  bold?: boolean
  mono?: boolean
}) {
  const color =
    accent === 'brand' ? 'text-brand-700' : accent === 'danger' ? 'text-danger-600' : 'text-ink-900'
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[12.5px] text-ink-400">{label}</span>
      <span
        className={`text-[13px] ${bold ? 'font-extrabold' : 'font-semibold'} ${color} ${mono ? 'tabular' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}
