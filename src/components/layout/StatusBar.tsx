import { useEffect, useState } from 'react'

/** Faux device status bar — keeps the prototype reading as a phone app. */
export function StatusBar({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const color = tone === 'light' ? 'text-white' : 'text-ink-900'
  const clock = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })

  return (
    <div className={`relative z-20 flex h-11 shrink-0 items-center justify-between px-6 pt-1 ${color}`}>
      <span className="text-[13px] font-semibold tabular">{clock}</span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7.5" width="2.6" height="3.5" rx="1" />
          <rect x="4.2" y="5.2" width="2.6" height="5.8" rx="1" />
          <rect x="8.4" y="2.6" width="2.6" height="8.4" rx="1" />
          <rect x="12.6" y="0" width="2.6" height="11" rx="1" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 10.4 5.3 8.1a3.2 3.2 0 0 1 4.4 0L7.5 10.4Z" />
          <path d="M2.9 5.7 1.3 4.1a8.8 8.8 0 0 1 12.4 0l-1.6 1.6a6.6 6.6 0 0 0-9.2 0Z" />
          <path d="M5 7.7 3.5 6.2a5.7 5.7 0 0 1 8 0L10 7.7a3.6 3.6 0 0 0-5 0Z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect
            x="0.6"
            y="0.6"
            width="20.5"
            height="10.8"
            rx="3"
            stroke="currentColor"
            strokeOpacity=".4"
          />
          <rect x="2.3" y="2.3" width="15.5" height="7.4" rx="1.8" fill="currentColor" />
          <path d="M22.8 4.1v3.8a2 2 0 0 0 0-3.8Z" fill="currentColor" fillOpacity=".45" />
        </svg>
      </div>
    </div>
  )
}
