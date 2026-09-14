import type { AIResult, WasteType } from '@/types'
import { delay } from '@/lib/delay'

/** Which result the bin simulator should produce next. */
export type DemoScenario = 'auto' | 'accepted' | 'incorrect' | 'rejected'

interface Scenario extends Omit<AIResult, 'imageKey'> {
  imageKey: WasteType
}

const ACCEPTED: Scenario[] = [
  { wasteType: 'organic', confidence: 96, weightKg: 0.8, status: 'accepted', imageKey: 'organic' },
  { wasteType: 'paper', confidence: 94, weightKg: 0.42, status: 'accepted', imageKey: 'paper' },
  { wasteType: 'organic', confidence: 98, weightKg: 1.05, status: 'accepted', imageKey: 'organic' },
  { wasteType: 'metal', confidence: 92, weightKg: 0.36, status: 'accepted', imageKey: 'metal' },
]

const INCORRECT: Scenario[] = [
  {
    wasteType: 'plastic',
    confidence: 91,
    weightKg: 0.25,
    status: 'incorrect',
    reason: 'Plastic placed in the organic bin',
    imageKey: 'plastic',
  },
  {
    wasteType: 'organic',
    confidence: 87,
    weightKg: 0.6,
    status: 'incorrect',
    reason: 'Contaminated waste — food mixed with packaging',
    imageKey: 'organic',
  },
]

const REJECTED: Scenario[] = [
  {
    wasteType: 'other',
    confidence: 84,
    weightKg: 0.48,
    status: 'rejected',
    reason: 'Non-recyclable material detected',
    imageKey: 'metal',
  },
]

/** In `auto` mode the simulator mostly accepts, with an occasional
 *  flagged deposit so a demo can show both paths. */
let autoTick = 0

function pick<T>(list: T[], i: number): T {
  return list[i % list.length]
}

function nextScenario(scenario: DemoScenario): Scenario {
  if (scenario === 'accepted') return pick(ACCEPTED, autoTick++)
  if (scenario === 'incorrect') return pick(INCORRECT, autoTick++)
  if (scenario === 'rejected') return pick(REJECTED, autoTick++)

  const t = autoTick++
  if (t % 4 === 2) return pick(INCORRECT, Math.floor(t / 4))
  if (t % 7 === 6) return pick(REJECTED, Math.floor(t / 7))
  return pick(ACCEPTED, t)
}

/** Jitter so repeated demo runs do not produce identical numbers. */
const jitter = (v: number, spread: number) =>
  Math.max(0.05, Math.round((v + (Math.random() - 0.5) * spread) * 100) / 100)

export const aiService = {
  /** The bin's load cell. Resolves once the reading settles. */
  async measureWeight(target: number): Promise<number> {
    await delay(1400)
    return jitter(target, 0.12)
  },

  /**
   * Classifies the captured frame.
   *
   * Mock implementation. To go live, replace this module with one that
   * POSTs the captured frame to Replicate and maps the vision model's
   * output onto the same `AIResult` shape — no UI changes required.
   */
  async classify(scenario: DemoScenario = 'auto'): Promise<AIResult> {
    const s = nextScenario(scenario)
    await delay(2400)
    return {
      ...s,
      weightKg: jitter(s.weightKg, 0.14),
      confidence: Math.min(99, Math.max(78, s.confidence + Math.round((Math.random() - 0.5) * 4))),
    }
  },
}
