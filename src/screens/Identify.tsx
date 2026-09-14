import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Info, KeyRound, Nfc } from 'lucide-react'
import { StatusBar } from '@/components/layout/StatusBar'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { LeafConfetti } from '@/components/brand/Logo'
import { authService } from '@/services/authService'
import { useApp } from '@/store/appContext'
import type { User } from '@/types'

type Phase = 'waiting' | 'detected' | 'welcome'

export default function Identify() {
  const navigate = useNavigate()
  const { signIn } = useApp()
  const [phase, setPhase] = useState<Phase>('waiting')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let alive = true
    authService.scanCard().then((res) => {
      if (!alive || !res.user) return
      setUser(res.user)
      setPhase('detected')
      setTimeout(() => alive && setPhase('welcome'), 1100)
    })
    return () => {
      alive = false
    }
  }, [])

  function proceed() {
    if (user) signIn(user)
    navigate('/home', { replace: true })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <StatusBar />
      {phase !== 'welcome' && <ScreenHeader title="Identify User" back="/login" />}

      <div className="relative flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {phase !== 'welcome' ? (
            <motion.div
              key="scan"
              exit={{ opacity: 0, scale: 0.97 }}
              className="flex flex-1 flex-col px-6 pb-8 pt-6"
            >
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl3 bg-brand-50/70 px-6 py-10">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  {phase === 'waiting' && (
                    <>
                      <span className="ww-ping absolute inset-0 rounded-full bg-brand-200/70" />
                      <span
                        className="ww-ping absolute inset-0 rounded-full bg-brand-200/70"
                        style={{ animationDelay: '.6s' }}
                      />
                    </>
                  )}
                  <motion.div
                    animate={phase === 'detected' ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`relative flex h-28 w-28 items-center justify-center rounded-full ${
                      phase === 'detected'
                        ? 'bg-brand-600 text-white'
                        : 'bg-white text-brand-600 shadow-soft'
                    }`}
                  >
                    {phase === 'detected' ? (
                      <Check size={44} strokeWidth={3} />
                    ) : (
                      <Nfc size={46} strokeWidth={1.7} />
                    )}
                  </motion.div>
                </div>

                <h2 className="mt-8 text-center text-[21px] font-extrabold tracking-tight text-ink-900">
                  {phase === 'detected' ? 'RFID detected' : 'Tap your RFID card'}
                </h2>
                <p className="mt-2 max-w-[15rem] text-center text-[13px] leading-relaxed text-ink-500">
                  {phase === 'detected'
                    ? `Identifying ${user?.name ?? 'user'}…`
                    : 'Hold your card near the reader to continue.'}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <Button variant="outline" icon={<KeyRound size={17} />} onClick={() => navigate('/login')}>
                  Enter User ID Manually
                </Button>
                <div className="flex items-start gap-2.5 rounded-2xl bg-info-100/70 px-4 py-3">
                  <Info size={16} className="mt-0.5 shrink-0 text-info-600" />
                  <p className="text-[12px] leading-relaxed text-ink-700">
                    <span className="font-semibold">Don&apos;t have a card?</span> Contact your
                    administrator to get your RFID card assigned.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative flex flex-1 flex-col items-center justify-center bg-[linear-gradient(180deg,#F0FAF4_0%,#DCF5E5_100%)] px-7 text-center"
            >
              <LeafConfetti count={9} />

              <div className="relative">
                <img
                  src={user?.avatar}
                  alt=""
                  className="h-28 w-28 rounded-full object-cover shadow-lift ring-4 ring-white"
                />
                <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white ring-4 ring-white">
                  <Check size={18} strokeWidth={3} />
                </span>
              </div>

              <p className="mt-7 text-[14px] font-medium text-ink-500">Welcome Back,</p>
              <h2 className="mt-0.5 text-[27px] font-extrabold tracking-tight text-ink-900">
                {user?.name}
              </h2>
              <p className="mt-1.5 text-[12.5px] font-medium text-ink-500">
                {user?.id} · {user?.department}
              </p>

              <div className="mt-7 w-full rounded-xl2 bg-white/70 p-4 text-left backdrop-blur">
                <p className="text-[13px] font-bold text-ink-900">Ready to make a difference?</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-500">
                  Track your waste, earn rewards and help keep our campus clean.
                </p>
              </div>

              <div className="mt-6 w-full">
                <Button onClick={proceed} iconRight={<ArrowRight size={18} />}>
                  Go to Dashboard
                </Button>
              </div>

              <p className="mt-5 text-[11.5px] italic text-ink-400">
                &ldquo;A cleaner tomorrow is a brighter tomorrow.&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
