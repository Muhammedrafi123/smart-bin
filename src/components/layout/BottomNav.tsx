import { NavLink, useNavigate } from 'react-router-dom'
import { Gift, History, House, ScanLine, User } from 'lucide-react'

const ITEMS = [
  { to: '/home', label: 'Home', Icon: House },
  { to: '/history', label: 'History', Icon: History },
  { to: '/rewards', label: 'Rewards', Icon: Gift },
  { to: '/profile', label: 'Profile', Icon: User },
] as const

export function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav className="relative z-30 shrink-0 border-t border-ink-200/70 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-nav backdrop-blur-xl">
      <div className="grid grid-cols-5 items-end">
        {ITEMS.slice(0, 2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/deposit')}
            aria-label="Deposit waste"
            className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-white shadow-[0_10px_24px_-8px_rgba(15,59,42,.75)] ring-4 ring-white transition-transform duration-150 active:scale-95"
          >
            <ScanLine size={23} />
          </button>
        </div>

        {ITEMS.slice(2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({ to, label, Icon }: { to: string; label: string; Icon: typeof House }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 pb-1 pt-0.5 transition-colors ${
          isActive ? 'text-brand-800' : 'text-ink-400'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={21} strokeWidth={isActive ? 2.4 : 1.9} />
          <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </>
      )}
    </NavLink>
  )
}
