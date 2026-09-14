import type { WasteType } from '@/types'
import organic from '@/assets/images/waste-organic.jpg'
import plastic from '@/assets/images/waste-plastic.jpg'
import paper from '@/assets/images/waste-paper.jpg'
import metal from '@/assets/images/waste-metal.jpg'

interface WasteMeta {
  label: string
  /** Tailwind classes for the soft tinted chip/avatar used in lists. */
  tint: string
  dot: string
  image: string
}

export const WASTE_META: Record<WasteType, WasteMeta> = {
  organic: { label: 'Organic', tint: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500', image: organic },
  paper: { label: 'Paper', tint: 'bg-info-100 text-info-600', dot: 'bg-info-600', image: paper },
  plastic: { label: 'Plastic', tint: 'bg-warn-100 text-warn-600', dot: 'bg-warn-600', image: plastic },
  metal: { label: 'Metal', tint: 'bg-ink-100 text-ink-700', dot: 'bg-ink-500', image: metal },
  glass: { label: 'Glass', tint: 'bg-info-100 text-info-600', dot: 'bg-info-600', image: plastic },
  other: { label: 'Other', tint: 'bg-ink-100 text-ink-700', dot: 'bg-ink-400', image: metal },
}

export const wasteLabel = (t: WasteType) => WASTE_META[t].label
