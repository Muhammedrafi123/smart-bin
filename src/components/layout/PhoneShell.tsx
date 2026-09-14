import type { ReactNode } from 'react'

/**
 * Renders the app full-bleed on a phone and inside a device frame on
 * larger screens, so the prototype presents well on a projector too.
 */
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,#EAF4EE_0%,#F5F7F6_45%,#EEF2F0_100%)] sm:p-6">
      <div className="relative w-full sm:w-[390px]">
        <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white sm:h-[min(844px,calc(100dvh-3rem))] sm:rounded-[2.75rem] sm:border-[10px] sm:border-ink-900 sm:shadow-[0_40px_90px_-30px_rgba(14,26,21,.55)]">
          {children}
        </div>
      </div>
    </div>
  )
}

/** Standard scrollable body for a screen. */
export function ScreenBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <main className={`screen-scroll no-scrollbar flex-1 ${className}`}>
      {children}
      <div className="h-4" />
    </main>
  )
}
