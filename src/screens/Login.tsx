import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Nfc, Sparkles, User2 } from 'lucide-react'
import { Wordmark } from '@/components/brand/Logo'
import { StatusBar } from '@/components/layout/StatusBar'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/authService'
import { useApp } from '@/store/appContext'
import { useToast } from '@/store/toastContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useApp()
  const toast = useToast()

  const [userId, setUserId] = useState('USR-001')
  const [password, setPassword] = useState('engo')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [busy, setBusy] = useState<'password' | 'demo' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy('password')
    const res = await authService.loginWithPassword(userId, password)
    setBusy(null)
    if (!res.ok || !res.user) return setError(res.error ?? 'Login failed.')
    signIn(res.user)
    toast(`Welcome back, ${res.user.name.split(' ')[0]}`)
    navigate('/home', { replace: true })
  }

  async function demo() {
    setBusy('demo')
    const res = await authService.loginAsDemo()
    setBusy(null)
    if (res.user) {
      signIn(res.user)
      navigate('/home', { replace: true })
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <StatusBar />

      <div className="screen-scroll no-scrollbar flex-1 px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-center pb-7 pt-6">
            <Wordmark size="lg" />
          </div>

          <h1 className="text-[26px] font-extrabold tracking-tight text-ink-900">Welcome Back</h1>
          <p className="mt-1 text-[13.5px] text-ink-400">Login to continue your green journey.</p>

          <form onSubmit={submit} className="mt-7 space-y-3.5">
            <Field
              icon={<User2 size={17} />}
              label="User ID"
              value={userId}
              onChange={setUserId}
              placeholder="USR-001"
              autoCapitalize="characters"
            />

            <Field
              icon={<Lock size={17} />}
              label="Password"
              value={password}
              onChange={setPassword}
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              trailing={
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="rounded-lg p-1 text-ink-400 transition-colors hover:text-ink-700"
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-danger-50 px-3.5 py-2.5 text-[12.5px] font-medium text-danger-600"
              >
                {error}
              </motion.p>
            )}

            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setRemember((r) => !r)}
                className="flex items-center gap-2 text-[12.5px] font-medium text-ink-700"
              >
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-[6px] border transition-colors ${
                    remember ? 'border-brand-600 bg-brand-600' : 'border-ink-200 bg-white'
                  }`}
                >
                  {remember && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4l2.6 2.6L9 1.2"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                Remember me
              </button>
              <button
                type="button"
                onClick={() => toast('Contact your administrator to reset your password.', 'info')}
                className="text-[12.5px] font-semibold text-brand-700"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-2">
              <Button type="submit" loading={busy === 'password'} iconRight={<ArrowRight size={18} />}>
                Login
              </Button>
            </div>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200" />
            <span className="text-[11px] font-semibold tracking-wide text-ink-400">OR</span>
            <div className="h-px flex-1 bg-ink-200" />
          </div>

          <div className="space-y-3">
            <Button variant="secondary" icon={<Nfc size={19} />} onClick={() => navigate('/identify')}>
              Login with RFID Card
            </Button>
            <Button
              variant="outline"
              icon={<Sparkles size={17} />}
              loading={busy === 'demo'}
              onClick={demo}
            >
              Demo Login (For Presentation)
            </Button>
          </div>

          <p className="mt-7 text-center text-[12px] text-ink-400">
            New here? <span className="font-semibold text-brand-700">Contact your administrator</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  onChange,
  trailing,
  type = 'text',
  placeholder,
  autoCapitalize,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  trailing?: React.ReactNode
  type?: string
  placeholder?: string
  autoCapitalize?: string
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-2.5 transition-colors focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
      <span className="text-ink-400">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10.5px] font-semibold tracking-wide text-ink-400">{label}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          autoComplete="off"
          className="w-full bg-transparent text-[14.5px] font-semibold text-ink-900 outline-none placeholder:font-normal placeholder:text-ink-200"
        />
      </span>
      {trailing}
    </label>
  )
}
