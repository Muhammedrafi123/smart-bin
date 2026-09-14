import { Apple, CupSoda, FileText, HelpCircle, Recycle, Wine } from 'lucide-react'
import type { WasteType } from '@/types'
import { WASTE_META } from '@/lib/waste'

const ICON = {
  organic: Apple,
  plastic: CupSoda,
  paper: FileText,
  metal: Recycle,
  glass: Wine,
  other: HelpCircle,
} as const

export function WasteIcon({ type, size = 40 }: { type: WasteType; size?: number }) {
  const Icon = ICON[type]
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl ${WASTE_META[type].tint}`}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.48} strokeWidth={2} />
    </div>
  )
}
