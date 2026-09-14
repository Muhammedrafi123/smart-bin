/**
 * Rasterise Lucide SVGs — the same icon family the app uses — into transparent
 * PNGs the deck generator can place.  Run from the project root:
 *     node deck/build-icons.mjs
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const SRC = path.join(process.cwd(), 'node_modules', 'lucide-static', 'icons')
const OUT = path.join(process.cwd(), 'deck', 'assets', 'icons')
fs.mkdirSync(OUT, { recursive: true })

const TONES = {
  light: '#DCF5E5',
  mint: '#5BC98C',
  green: '#248A5E',
  dark: '#0F3B2A',
  ink: '#5C6B64',
  red: '#D64545',
  white: '#FFFFFF',
  amber: '#C97A11',
}

/** icon name -> tones to render */
const WANTED = {
  'user-round': ['light', 'green', 'dark'],
  users: ['green', 'light'],
  nfc: ['light', 'green', 'mint', 'dark', 'ink'],
  'trash-2': ['light', 'green', 'dark'],
  recycle: ['light', 'green', 'mint', 'dark'],
  'scan-eye': ['light', 'green', 'mint'],
  cpu: ['light', 'green', 'mint', 'ink'],
  camera: ['light', 'green', 'mint', 'ink'],
  gauge: ['light', 'green', 'mint', 'ink'],
  gift: ['light', 'green', 'mint'],
  award: ['green', 'light'],
  'triangle-alert': ['red', 'light', 'amber'],
  database: ['light', 'green', 'mint'],
  server: ['light', 'green', 'mint'],
  smartphone: ['light', 'green', 'mint', 'dark'],
  'radio-tower': ['light', 'green', 'mint'],
  'circuit-board': ['light', 'green', 'mint'],
  leaf: ['light', 'green', 'mint', 'white'],
  'shield-check': ['green', 'light', 'red'],
  sparkles: ['light', 'green', 'mint'],
  'arrow-right': ['mint', 'green', 'light', 'ink'],
  check: ['mint', 'green', 'white', 'light'],
  'chart-column': ['green', 'light'],
  'eye-off': ['green', 'light'],
  'clipboard-list': ['green', 'light'],
  'hand-coins': ['green', 'light'],
  layers: ['green', 'light', 'mint'],
  'map-pin': ['green', 'light'],
  'trending-up': ['green', 'light', 'mint'],
  'package-open': ['light', 'green', 'mint'],
  cog: ['light', 'green', 'mint', 'ink'],
  wifi: ['light', 'green', 'mint'],
  'file-text': ['light', 'green', 'mint'],
  'hard-drive': ['light', 'green', 'mint'],
  'scan-line': ['light', 'green', 'mint'],
  'refresh-cw': ['green', 'light'],
  'circle-check-big': ['mint', 'green', 'light'],
  'circle-dashed': ['light', 'ink', 'mint'],
  weight: ['light', 'green', 'mint', 'ink'],
  'indian-rupee': ['red', 'light'],
  'chevron-right': ['mint', 'ink', 'light', 'dark'],
  factory: ['light', 'green', 'mint'],
  brain: ['light', 'green', 'mint'],
}

const missing = []
const jobs = []
for (const [name, tones] of Object.entries(WANTED)) {
  const file = path.join(SRC, `${name}.svg`)
  if (!fs.existsSync(file)) {
    missing.push(name)
    continue
  }
  const raw = fs.readFileSync(file, 'utf8')
  for (const tone of tones) jobs.push({ name, tone, raw })
}

if (missing.length) {
  console.error('MISSING ICONS:', missing.join(', '))
  process.exit(1)
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 300, height: 300 }, deviceScaleFactor: 1 })

for (const { name, tone, raw } of jobs) {
  const svg = raw
    .replace('<svg', '<svg id="ic"')
    .replace(/width="24"/, 'width="256"')
    .replace(/height="24"/, 'height="256"')
    .replace(/stroke="currentColor"/, `stroke="${TONES[tone]}"`)
    .replace(/stroke-width="2"/, 'stroke-width="1.9"')
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg}</body></html>`,
  )
  const el = await page.$('#ic')
  await el.screenshot({
    path: path.join(OUT, `${name}-${tone}.png`),
    omitBackground: true,
  })
}

await browser.close()
console.log(`rendered ${jobs.length} icons ->`, path.relative(process.cwd(), OUT))
