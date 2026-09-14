import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'md' | 'lg' | 'sm'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-900 text-white shadow-soft hover:bg-brand-800 active:bg-brand-950',
  secondary: 'bg-brand-100 text-brand-800 hover:bg-brand-200 active:bg-brand-200',
  outline: 'border border-ink-200 bg-white text-ink-900 hover:bg-ink-100/60',
  ghost: 'text-ink-500 hover:bg-ink-100',
  danger: 'bg-danger-600 text-white hover:brightness-105',
}

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-4 text-[13px] rounded-xl gap-1.5',
  md: 'h-12 px-5 text-sm rounded-2xl gap-2',
  lg: 'h-14 px-6 text-[15px] rounded-2xl gap-2',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  block?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  block = true,
  icon,
  iconRight,
  className = '',
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[.985] disabled:pointer-events-none disabled:opacity-50 ${
        VARIANTS[variant]
      } ${SIZES[size]} ${block ? 'w-full' : ''} ${className}`}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
}
