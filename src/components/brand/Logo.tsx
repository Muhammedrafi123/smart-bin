interface Props {
  size?: number
  /** Leaf colour. Defaults to the fresh green used on light surfaces. */
  tone?: 'dark' | 'light'
  className?: string
}

/** ENGO leaf mark — a leaf whose midrib doubles as a recycling sweep. */
export function LeafMark({ size = 32, tone = 'dark', className = '' }: Props) {
  const leaf = tone === 'light' ? '#DCF5E5' : '#248A5E'
  const accent = tone === 'light' ? '#8EDCAE' : '#5BC98C'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M33 6.5c0 12.4-7.6 20.2-16.6 20.2-2 0-3.9-.35-5.6-1C12.6 15.9 20.6 8.9 33 6.5Z"
        fill={leaf}
      />
      <path
        d="M20.5 4.2c-7.6 1.9-12.9 6.7-13.9 13-.5 3.3.4 6.3 2.2 8.4C11.9 15.3 15.4 8.6 20.5 4.2Z"
        fill={accent}
      />
      <path d="M7 35.5c1.3-6.3 4.4-11.6 9-15.5" stroke={leaf} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({
  size = 'md',
  tone = 'dark',
  tagline = true,
}: {
  size?: 'sm' | 'md' | 'lg'
  tone?: 'dark' | 'light'
  tagline?: boolean
}) {
  const mark = { sm: 24, md: 34, lg: 46 }[size]
  const title = { sm: 'text-lg', md: 'text-2xl', lg: 'text-[32px]' }[size]
  const text = tone === 'light' ? 'text-white' : 'text-brand-900'
  const sub = tone === 'light' ? 'text-white/70' : 'text-ink-400'

  return (
    <div className="flex items-center gap-2.5">
      <LeafMark size={mark} tone={tone} />
      <div className="leading-none">
        <div className={`${title} font-extrabold tracking-tight ${text}`}>ENGO</div>
        {tagline && (
          <div className={`mt-1 text-[10.5px] font-medium tracking-wide ${sub}`}>
            Small Actions. A Cleaner Tomorrow.
          </div>
        )}
      </div>
    </div>
  )
}

/** Decorative drifting leaves used on celebratory screens. */
export function LeafConfetti({ count = 7 }: { count?: number }) {
  const leaves = Array.from({ length: count }, (_, i) => ({
    left: `${8 + ((i * 37) % 84)}%`,
    top: `${10 + ((i * 53) % 72)}%`,
    scale: 0.55 + ((i * 13) % 7) / 10,
    delay: `${(i * 0.45).toFixed(2)}s`,
  }))
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {leaves.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="ww-float absolute text-brand-300"
          style={{
            left: l.left,
            top: l.top,
            width: 22 * l.scale,
            height: 22 * l.scale,
            animationDelay: l.delay,
            opacity: 0.75,
          }}
          fill="currentColor"
        >
          <path d="M20 3c0 8.8-5.4 14-12 14-1.2 0-2.3-.2-3.3-.5C5.6 9.6 11.6 4.6 20 3Z" />
        </svg>
      ))}
    </div>
  )
}
