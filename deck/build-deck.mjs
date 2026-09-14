/**
 * ENGO — pitch deck generator.
 *   node deck/build-deck.mjs
 *
 * Assets come from deck/assets (see build-assets.py and build-icons.mjs).
 */
import pptxgen from 'pptxgenjs'
import path from 'node:path'
import fs from 'node:fs'

const ROOT = process.cwd()
const A = (f) => path.join(ROOT, 'deck', 'assets', f)
const ICON = (name, tone) => path.join(ROOT, 'deck', 'assets', 'icons', `${name}-${tone}.png`)
const PHONE = (name) => A(`phone-${name}.png`)

for (const f of [A('bg-forest.jpg'), A('photo-waste-duotone.jpg'), PHONE('home')]) {
  if (!fs.existsSync(f)) throw new Error('missing asset: ' + f)
}

/* ---------------- design tokens ---------------- */

const C = {
  deep: '0F3B2A',
  deepest: '08261A',
  green: '248A5E',
  mid: '2FA86F',
  mint: '5BC98C',
  pale: 'BCEBCE',
  wash: 'DCF5E5',
  tintBg: 'F0FAF4',
  ink: '0E1A15',
  ink70: '2C3A34',
  ink50: '5C6B64',
  ink40: '8A9993',
  line: 'DFE5E2',
  canvas: 'F5F7F6',
  white: 'FFFFFF',
  red: 'D64545',
  redBg: 'FDECEA',
  amber: 'C97A11',
  amberBg: 'FDF0DC',
}

const F = 'Calibri'

// Each mockup PNG carries its own shadow padding, so widths come from a
// manifest rather than one shared constant.
const MOCKUPS = JSON.parse(fs.readFileSync(A('mockups.json'), 'utf8'))
const phoneW = (h, name = 'home') => {
  const [w, ht] = MOCKUPS[name]
  return +((h * w) / ht).toFixed(3)
}

const M = { l: 0.75, r: 0.75, top: 0.62 }
const CW = 13.333 - M.l - M.r // 11.833

const soft = () => ({ type: 'outer', color: '0E1A15', blur: 14, offset: 3, angle: 90, opacity: 0.1 })

const pres = new pptxgen()
pres.layout = 'LAYOUT_WIDE' // 13.333 x 7.5
pres.author = 'ENGO'
pres.title = 'ENGO — Smart Waste Management System'

/* ---------------- helpers ---------------- */

function darkBg(slide, image) {
  slide.background = { color: C.deepest }
  if (image) {
    slide.addImage({ path: image, x: 0, y: 0, w: 13.333, h: 7.5, sizing: { type: 'cover', w: 13.333, h: 7.5 } })
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.deepest, transparency: 16 }, line: { type: 'none' },
    })
  }
}

function lightBg(slide) {
  slide.background = { color: C.white }
}

function footer(slide, n, dark = false, leftX = M.l) {
  slide.addText('ENGO', {
    x: leftX, y: 6.98, w: 3, h: 0.3, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 9.5, bold: true, charSpacing: 2,
    color: dark ? C.mint : C.ink40,
  })
  slide.addText(`${String(n).padStart(2, '0')} / 12`, {
    x: 13.333 - M.r - 3, y: 6.98, w: 3, h: 0.3, isTextBox: true, margin: 0, valign: 'middle', align: 'right',
    fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1,
    color: dark ? 'FFFFFF' : C.ink40, transparency: dark ? 45 : 0,
  })
}

function eyebrow(slide, x, y, num, label, dark = false) {
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.085, w: 0.28, h: 0.055, fill: { color: dark ? C.mint : C.green }, line: { type: 'none' },
  })
  slide.addText(`${num}  ${label}`, {
    x: x + 0.42, y, w: 8, h: 0.24, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 10.5, bold: true, charSpacing: 2.4,
    color: dark ? C.mint : C.green,
  })
}

function pill(slide, { x, y, text, fg, bg, w = 2.1, h = 0.32, size = 9.5 }) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: h / 2, fill: { color: bg }, line: { type: 'none' },
  })
  slide.addText(text, {
    x, y, w, h, isTextBox: true, margin: 0, align: 'center', valign: 'middle',
    fontFace: F, fontSize: size, bold: true, charSpacing: 1, color: fg,
  })
}

function card(slide, { x, y, w, h, fill = C.white, line = C.line, radius = 0.16, shadow = true }) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: radius,
    fill: { color: fill },
    line: line ? { color: line, width: 0.75 } : { type: 'none' },
    ...(shadow ? { shadow: soft() } : {}),
  })
}

function iconCircle(slide, { cx, cy, d, bg, icon, tone, iconScale = 0.46, ring }) {
  slide.addShape(pres.ShapeType.ellipse, {
    x: cx - d / 2, y: cy - d / 2, w: d, h: d,
    fill: { color: bg },
    line: ring ? { color: ring, width: 0.9 } : { type: 'none' },
  })
  const s = d * iconScale
  slide.addImage({ path: ICON(icon, tone), x: cx - s / 2, y: cy - s / 2, w: s, h: s })
}

function arrowRight(slide, { cx, cy, size = 0.26, tone = 'mint' }) {
  slide.addImage({ path: ICON('arrow-right', tone), x: cx - size / 2, y: cy - size / 2, w: size, h: size })
}

/* =====================================================================
   01 — COVER
   ===================================================================== */
{
  const s = pres.addSlide()
  darkBg(s, A('bg-forest.jpg'))

  s.addImage({ path: ICON('leaf', 'mint'), x: M.l, y: 0.78, w: 0.42, h: 0.42 })
  s.addText('ENGO', {
    x: M.l + 0.54, y: 0.76, w: 3, h: 0.46, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 25, bold: true, charSpacing: 3, color: C.white,
  })

  s.addText('SMART WASTE MANAGEMENT SYSTEM', {
    x: M.l, y: 2.0, w: 7.4, h: 0.28, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 11, bold: true, charSpacing: 3.4, color: C.mint,
  })

  s.addText('Small Actions.\nA Cleaner Tomorrow.', {
    x: M.l, y: 2.45, w: 7.6, h: 2.1, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 52, bold: true, color: C.white, lineSpacingMultiple: 0.95,
  })

  s.addText(
    'An RFID + AI powered smart bin that turns every waste deposit into a measurable, rewarded action.',
    {
      x: M.l, y: 4.72, w: 6.6, h: 0.72, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 14, color: C.wash, transparency: 22, lineSpacingMultiple: 1.25,
    },
  )

  s.addShape(pres.ShapeType.line, {
    x: M.l, y: 5.62, w: 1.1, h: 0, line: { color: C.mint, width: 2 },
  })
  s.addText('Software  ×  AI  ×  IoT  ×  Sustainable Waste Management', {
    x: M.l, y: 5.82, w: 7.4, h: 0.3, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 11.5, bold: true, charSpacing: 1.4, color: C.pale,
  })

  pill(s, {
    x: M.l, y: 6.4, w: 3.05, h: 0.36, text: 'WORKING FRONTEND PROTOTYPE',
    fg: C.deepest, bg: C.mint, size: 9,
  })

  const ph = 7.34
  s.addImage({ path: PHONE('home'), x: 8.72, y: 0.08, w: phoneW(ph), h: ph })

  footer(s, 1, true)
  s.addNotes(
    'ENGO is a smart waste management system for our campus. What you are looking at is a working mobile ' +
      'application prototype. It is frontend only today: the data is mock data and the hardware and AI are ' +
      'simulated. The backend, the ESP32 hardware and the production AI are the proposed next phases.',
  )
}

/* =====================================================================
   02 — THE PROBLEM
   ===================================================================== */
{
  const s = pres.addSlide()
  lightBg(s)

  s.addImage({
    path: A('photo-waste-duotone.jpg'), x: 0, y: 0, w: 5.05, h: 7.5,
    sizing: { type: 'cover', w: 5.05, h: 7.5 },
  })

  const x = 5.95
  const w = 13.333 - x - M.r

  eyebrow(s, x, 0.78, '02', 'THE PROBLEM')

  s.addText('Waste management starts with one simple problem.', {
    x, y: 1.28, w, h: 1.7, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 34, bold: true, color: C.ink, lineSpacingMultiple: 1.02,
  })

  s.addText('Campuses collect waste every day. Almost none of them can measure it.', {
    x, y: 3.02, w, h: 0.4, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 13.5, color: C.ink50,
  })

  const items = [
    ['eye-off', 'Poor segregation', 'Recyclables, organics and plastic end up in the same bin.'],
    ['clipboard-list', 'Limited accountability', 'No record of who disposed what, or how well they sorted it.'],
    ['refresh-cw', 'Manual monitoring', 'Staff check fill levels by hand and log them on paper.'],
    ['hand-coins', 'No user engagement', 'Nothing rewards the people who actually sort correctly.'],
  ]

  items.forEach(([ic, title, body], i) => {
    const y = 3.68 + i * 0.83
    iconCircle(s, { cx: x + 0.26, cy: y + 0.26, d: 0.52, bg: C.tintBg, icon: ic, tone: 'green' })
    s.addText(title, {
      x: x + 0.72, y: y - 0.04, w: w - 0.72, h: 0.28, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 14, bold: true, color: C.ink,
    })
    s.addText(body, {
      x: x + 0.72, y: y + 0.24, w: w - 0.72, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, color: C.ink50,
    })
  })

  footer(s, 2, false, 5.95)
  s.addNotes(
    'Four problems, and they compound. Without segregation at the source, recycling downstream barely works. ' +
      'Without a record of each deposit there is no accountability, and without accountability there is no ' +
      'incentive for anyone to change behaviour.',
  )
}

/* =====================================================================
   03 — THE IDEA
   ===================================================================== */
{
  const s = pres.addSlide()
  lightBg(s)
  eyebrow(s, M.l, M.top + 0.16, '03', 'THE IDEA')

  s.addText('What if waste disposal became measurable, intelligent and rewarding?', {
    x: M.l, y: 1.28, w: 10.2, h: 1.35, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 34, bold: true, color: C.ink, lineSpacingMultiple: 1.02,
  })

  const nodes = [
    ['user-round', 'User', 'Arrives at the bin'],
    ['nfc', 'RFID', 'Card identifies them'],
    ['trash-2', 'Smart Bin', 'Lid opens, waste in'],
    ['scan-eye', 'AI Analysis', 'Type and weight read'],
    ['factory', 'Processing', 'Routed for treatment'],
    ['file-text', 'Digital Record', 'Transaction stored'],
    ['gift', 'Reward', 'Points or penalty'],
  ]

  const pitch = CW / nodes.length
  const cy = 3.66
  const d = 1.0

  // connector rail behind the circles
  s.addShape(pres.ShapeType.line, {
    x: M.l + pitch / 2, y: cy, w: CW - pitch, h: 0, line: { color: C.pale, width: 1.5 },
  })

  nodes.forEach(([ic, title, sub], i) => {
    const cx = M.l + pitch * i + pitch / 2
    const last = i === nodes.length - 1
    s.addShape(pres.ShapeType.ellipse, {
      x: cx - d / 2 - 0.07, y: cy - d / 2 - 0.07, w: d + 0.14, h: d + 0.14,
      fill: { color: C.white }, line: { type: 'none' },
    })
    iconCircle(s, {
      cx, cy, d,
      bg: last ? C.green : C.tintBg,
      ring: last ? undefined : C.pale,
      icon: ic,
      tone: last ? 'light' : 'green',
      iconScale: 0.42,
    })
    s.addText(title, {
      x: cx - pitch / 2 + 0.06, y: cy + 0.62, w: pitch - 0.12, h: 0.28, isTextBox: true, margin: 0,
      align: 'center', valign: 'middle', fontFace: F, fontSize: 13, bold: true, color: C.ink,
    })
    s.addText(sub, {
      x: cx - pitch / 2 + 0.06, y: cy + 0.9, w: pitch - 0.12, h: 0.5, isTextBox: true, margin: 0,
      align: 'center', fontFace: F, fontSize: 10, color: C.ink40, lineSpacingMultiple: 1.1,
    })
  })

  card(s, { x: M.l, y: 5.78, w: CW, h: 0.85, fill: C.tintBg, line: C.wash, shadow: false })
  s.addImage({ path: ICON('leaf', 'green'), x: M.l + 0.42, y: 6.07, w: 0.28, h: 0.28 })
  s.addText(
    'Every deposit becomes a verifiable digital transaction — identified, weighed, classified and scored.',
    {
      x: M.l + 0.86, y: 5.78, w: CW - 1.3, h: 0.85, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 13.5, bold: true, color: C.deep,
    },
  )

  footer(s, 3)
  s.addNotes(
    'The idea in one line: make the bin know who you are and what you threw away. Once that exists, every ' +
      'other feature — scoring, rewards, penalties, fill-level analytics — follows from the same record.',
  )
}

/* =====================================================================
   04 — HOW ENGO WORKS
   ===================================================================== */
{
  const s = pres.addSlide()
  s.background = { color: C.canvas }
  eyebrow(s, M.l, M.top + 0.16, '04', 'HOW ENGO WORKS')

  s.addText('Five steps, start to finish.', {
    x: M.l, y: 1.22, w: 7, h: 0.7, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 34, bold: true, color: C.ink,
  })
  s.addText('The same five steps drive the app, the scoring rules and the future hardware.', {
    x: M.l, y: 1.95, w: 8.6, h: 0.36, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 13.5, color: C.ink50,
  })

  const steps = [
    ['nfc', '01', 'Identify', 'An RFID card links the deposit to a specific student account.'],
    ['package-open', '02', 'Deposit', 'The bin unlocks and the waste is placed inside.'],
    ['scan-eye', '03', 'Analyze', 'A camera and load cell determine the type and the weight.'],
    ['factory', '04', 'Process', 'Waste is routed into the right processing stream.'],
    ['gift', '05', 'Reward', 'Correct disposal earns eco points; mistakes cost them.'],
  ]

  const gap = 0.26
  const cw = (CW - gap * (steps.length - 1)) / steps.length
  const cy0 = 2.62
  const ch = 3.5

  steps.forEach(([ic, num, title, body], i) => {
    const x = M.l + (cw + gap) * i
    const highlight = i === 0
    card(s, {
      x, y: cy0, w: cw, h: ch,
      fill: highlight ? C.deep : C.white,
      line: highlight ? null : C.line,
    })
    s.addText(num, {
      x: x + 0.3, y: cy0 + 0.28, w: 1.2, h: 0.6, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 30, bold: true, color: highlight ? C.mint : C.pale,
    })
    iconCircle(s, {
      cx: x + cw - 0.6, cy: cy0 + 0.6, d: 0.62,
      bg: highlight ? '17513A' : C.tintBg,
      icon: ic, tone: highlight ? 'mint' : 'green', iconScale: 0.46,
    })
    s.addText(title, {
      x: x + 0.3, y: cy0 + 1.92, w: cw - 0.6, h: 0.4, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 17, bold: true, color: highlight ? C.white : C.ink,
    })
    s.addText(body, {
      x: x + 0.3, y: cy0 + 2.4, w: cw - 0.6, h: 0.98, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, color: highlight ? C.pale : C.ink50, lineSpacingMultiple: 1.2,
    })
  })

  s.addText(
    'All five steps are modelled end to end in the prototype. Steps 1–4 currently run on simulated sensor and AI output.',
    {
      x: M.l, y: 6.35, w: CW, h: 0.34, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 11.5, italic: true, color: C.ink40,
    },
  )

  footer(s, 4)
  s.addNotes(
    'Identify, deposit, analyze, process, reward. The prototype walks through all five on screen. ' +
      'Steps one to four are driven by a simulator today rather than by real hardware.',
  )
}

/* =====================================================================
   05 — THE MOBILE APPLICATION
   ===================================================================== */
{
  const s = pres.addSlide()
  lightBg(s)
  eyebrow(s, M.l, M.top + 0.1, '05', 'THE MOBILE APPLICATION')

  s.addText('One app. One complete waste journey.', {
    x: M.l, y: 1.12, w: 7.4, h: 0.66, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: C.ink,
  })
  s.addText(
    'Thirteen screens, built in React and TypeScript, running on realistic mock data. Every interaction below is live in the prototype.',
    {
      x: 8.45, y: 1.1, w: 4.14, h: 0.9, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, color: C.ink50, lineSpacingMultiple: 1.25,
    },
  )

  const shots = [
    ['home', 'Home Dashboard', 'Eco score, totals and recent activity'],
    ['rfid', 'Deposit Waste', 'RFID identification at the bin'],
    ['analyzing', 'AI Detection', 'Live classification progress'],
    ['result', 'Transaction Result', 'Type, weight, confidence, reward'],
  ]

  const ph = 4.12
  const pw = phoneW(ph)
  const gap = (CW - pw * 4) / 3
  const py = 1.96

  shots.forEach(([key, title, sub], i) => {
    const x = M.l + (pw + gap) * i
    s.addImage({ path: PHONE(key), x, y: py, w: pw, h: ph })
    s.addText(title, {
      x, y: py + ph + 0.06, w: pw, h: 0.28, isTextBox: true, margin: 0, align: 'center', valign: 'middle',
      fontFace: F, fontSize: 13, bold: true, color: C.ink,
    })
    s.addText(sub, {
      x: x - 0.15, y: py + ph + 0.36, w: pw + 0.3, h: 0.34, isTextBox: true, margin: 0, align: 'center',
      fontFace: F, fontSize: 10, color: C.ink40, lineSpacingMultiple: 1.1,
    })
  })

  footer(s, 5)
  s.addNotes(
    'These are real screenshots of the running prototype, not mockups. Login, navigation, the deposit flow, ' +
      'history, rewards, penalties and the profile all work.',
  )
}

/* =====================================================================
   06 — USER EXPERIENCE
   ===================================================================== */
{
  const s = pres.addSlide()
  darkBg(s)
  eyebrow(s, M.l, M.top + 0.1, '06', 'USER EXPERIENCE', true)

  s.addText('From RFID tap to verified waste transaction.', {
    x: M.l, y: 1.1, w: 8.2, h: 0.66, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: C.white,
  })
  s.addText('Roughly twelve seconds, four screens, zero paperwork.', {
    x: 8.9, y: 1.22, w: 3.7, h: 0.5, isTextBox: true, margin: 0, align: 'right',
    fontFace: F, fontSize: 12, color: C.pale, transparency: 18,
  })

  const steps = [
    ['rfid', '01', 'Identify', 'Card tapped, user recognised'],
    ['weighing', '02', 'Measure', 'Load cell settles on a weight'],
    ['analyzing', '03', 'Analyze', 'Vision model classifies the waste'],
    ['result', '04', 'Record', 'Transaction written, points applied'],
  ]

  const ph = 3.78
  const pw = phoneW(ph)
  const gap = (CW - pw * 4) / 3
  const py = 2.52

  steps.forEach(([key, num, title, sub], i) => {
    const x = M.l + (pw + gap) * i
    s.addText(`${num}   ${title}`, {
      x: x + pw * 0.078, y: 2.02, w: pw + 0.8, h: 0.3, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 12.5, bold: true, charSpacing: 1, color: C.mint,
    })
    s.addImage({ path: PHONE(key), x, y: py, w: pw, h: ph })
    s.addText(sub, {
      x: x - 0.2, y: py + ph + 0.02, w: pw + 0.4, h: 0.34, isTextBox: true, margin: 0, align: 'center',
      fontFace: F, fontSize: 10, color: C.pale, transparency: 25, lineSpacingMultiple: 1.1,
    })
    if (i < 3) arrowRight(s, { cx: x + pw + gap / 2, cy: py + ph / 2, size: 0.3, tone: 'mint' })
  })

  footer(s, 6, true)
  s.addNotes(
    'This is the demo we run live. The whole sequence is automatic once you open the deposit screen — it ' +
      'mirrors what the physical bin would emit. A simulator panel lets us force an accepted or a rejected ' +
      'result on demand.',
  )
}

/* =====================================================================
   07 — AI WASTE DETECTION
   ===================================================================== */
{
  const s = pres.addSlide()
  lightBg(s)
  eyebrow(s, M.l, M.top + 0.1, '07', 'AI WASTE DETECTION')
  pill(s, {
    x: 10.35, y: M.top + 0.04, w: 2.23, h: 0.36, text: 'PROPOSED INTEGRATION',
    fg: C.amber, bg: C.amberBg, size: 9,
  })

  s.addText('AI understands what goes into the bin.', {
    x: M.l, y: 1.12, w: 8.6, h: 0.66, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: C.ink,
  })

  const ph = 4.5
  s.addImage({ path: PHONE('analyzing'), x: M.l - 0.12, y: 2.0, w: phoneW(ph), h: ph })

  const x = 3.35
  const w = 13.333 - x - M.r

  const flow = [
    ['camera', 'Camera captures the waste', 'A frame is taken the moment the lid closes.'],
    ['brain', 'Vision model analyses the image', 'A hosted model returns a category and a confidence score.'],
    ['layers', 'System decides the outcome', 'Accept, flag as incorrect, or reject — then score it.'],
  ]

  flow.forEach(([ic, title, body], i) => {
    const y = 2.02 + i * 1.24
    card(s, { x, y, w, h: 1.0 })
    iconCircle(s, { cx: x + 0.62, cy: y + 0.5, d: 0.66, bg: C.tintBg, icon: ic, tone: 'green' })
    s.addText(title, {
      x: x + 1.12, y: y + 0.14, w: w - 1.5, h: 0.32, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 14.5, bold: true, color: C.ink,
    })
    s.addText(body, {
      x: x + 1.12, y: y + 0.46, w: w - 1.5, h: 0.34, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, color: C.ink50,
    })
    if (i < 2) {
      s.addShape(pres.ShapeType.line, {
        x: x + 0.62, y: y + 1.0, w: 0, h: 0.24, line: { color: C.pale, width: 1.5 },
      })
    }
  })

  const cats = ['Organic', 'Paper', 'Plastic', 'Metal', 'Other']
  const cgap = 0.18
  const cwid = (w - cgap * (cats.length - 1)) / cats.length
  cats.forEach((label, i) => {
    const cx = x + (cwid + cgap) * i
    s.addShape(pres.ShapeType.roundRect, {
      x: cx, y: 5.76, w: cwid, h: 0.56, rectRadius: 0.14,
      fill: { color: i === 0 ? C.green : C.tintBg },
      line: i === 0 ? { type: 'none' } : { color: C.wash, width: 0.75 },
    })
    s.addText(label, {
      x: cx, y: 5.76, w: cwid, h: 0.56, isTextBox: true, margin: 0, align: 'center', valign: 'middle',
      fontFace: F, fontSize: 12.5, bold: true, color: i === 0 ? C.white : C.green,
    })
  })

  s.addText(
    'Today the prototype returns mock classifications from a single aiService module. Swapping it for a hosted vision model — Replicate, for example — needs no change to the interface.',
    {
      x, y: 6.5, w, h: 0.5, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10.5, italic: true, color: C.ink40, lineSpacingMultiple: 1.15,
    },
  )

  footer(s, 7)
  s.addNotes(
    'To be clear: the AI is not live yet. The prototype returns scripted classifications with realistic ' +
      'confidence scores. The architecture is deliberately shaped so a real vision model drops into one file.',
  )
}

/* =====================================================================
   08 — REWARDS & ACCOUNTABILITY
   ===================================================================== */
{
  const s = pres.addSlide()
  s.background = { color: C.canvas }
  eyebrow(s, M.l, M.top + 0.1, '08', 'REWARDS & ACCOUNTABILITY')

  s.addText('Encourage better habits. Build accountability.', {
    x: M.l, y: 1.1, w: 9, h: 0.66, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: C.ink,
  })

  const panelW = (CW - 0.42) / 2
  const py = 1.95
  const phH = 3.5
  const phW = phoneW(phH)

  const panels = [
    {
      x: M.l, title: 'REWARD', tint: C.tintBg, edge: C.wash, accent: C.green, phone: 'rewards',
      chipFg: C.white, chipBg: C.green,
      steps: [
        ['circle-check-big', 'Correct disposal', 'Sorted into the right bin'],
        ['trending-up', 'Eco points earned', '+20 points per kilogram'],
        ['gift', 'Redeem rewards', 'Badges, coupons, a planted tree'],
      ],
      tone: 'green',
    },
    {
      x: M.l + panelW + 0.42, title: 'ACCOUNTABILITY', tint: 'FDF3F2', edge: 'F8DEDA', accent: C.red,
      phone: 'penalties', chipFg: C.white, chipBg: C.red,
      steps: [
        ['triangle-alert', 'Incorrect disposal', 'Wrong bin or contaminated waste'],
        ['indian-rupee', 'Penalty applied', 'Points deducted, small fine logged'],
        ['shield-check', 'User awareness', 'The app explains exactly what went wrong'],
      ],
      tone: 'red',
    },
  ]

  panels.forEach((p) => {
    card(s, { x: p.x, y: py, w: panelW, h: 4.45, fill: p.tint, line: p.edge, radius: 0.2, shadow: false })
    pill(s, { x: p.x + 0.42, y: py + 0.34, w: 1.62, h: 0.34, text: p.title, fg: p.chipFg, bg: p.chipBg, size: 9 })

    s.addImage({ path: PHONE(p.phone), x: p.x + 0.24, y: py + 0.77, w: phW, h: phH })

    const tx = p.x + 0.24 + phW + 0.16
    const tw = panelW - (tx - p.x) - 0.42

    p.steps.forEach(([ic, title, body], i) => {
      const y = py + 1.06 + i * 1.02
      iconCircle(s, {
        cx: tx + 0.28, cy: y + 0.28, d: 0.56, bg: C.white,
        icon: ic, tone: p.tone === 'red' ? 'red' : 'green', iconScale: 0.44,
      })
      s.addText(title, {
        x: tx + 0.7, y: y - 0.02, w: tw - 0.7, h: 0.3, isTextBox: true, margin: 0, valign: 'middle',
        fontFace: F, fontSize: 13, bold: true, color: C.ink,
      })
      s.addText(body, {
        x: tx + 0.7, y: y + 0.28, w: tw - 0.7, h: 0.36, isTextBox: true, margin: 0,
        fontFace: F, fontSize: 10.5, color: C.ink50, lineSpacingMultiple: 1.12,
      })
      if (i < 2) {
        s.addShape(pres.ShapeType.line, {
          x: tx + 0.28, y: y + 0.6, w: 0, h: 0.42, line: { color: p.edge, width: 1.5 },
        })
      }
    })
  })

  s.addText(
    'Penalties are framed as guidance, not punishment: every flagged deposit explains the reason, and points reset after 30 clean days.',
    {
      x: M.l, y: 6.56, w: CW, h: 0.32, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 11.5, italic: true, color: C.ink40,
    },
  )

  footer(s, 8)
  s.addNotes(
    'The reward side is the carrot; the penalty side is the record. We deliberately kept the penalty screen ' +
      'educational — it tells you what went wrong and how to avoid it, and the points expire.',
  )
}

/* =====================================================================
   09 — PROPOSED SYSTEM ARCHITECTURE
   ===================================================================== */
{
  const s = pres.addSlide()
  darkBg(s)
  eyebrow(s, M.l, M.top + 0.1, '09', 'SYSTEM ARCHITECTURE', true)
  pill(s, {
    x: 10.05, y: M.top + 0.04, w: 2.53, h: 0.36, text: 'PROPOSED FINAL ARCHITECTURE',
    fg: C.deepest, bg: C.mint, size: 8.5,
  })

  s.addText('Connecting the physical and digital worlds.', {
    x: M.l, y: 1.08, w: 9, h: 0.62, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: C.white,
  })

  const rows = [
    {
      label: 'PRESENTATION', built: true,
      nodes: [['user-round', 'User'], ['smartphone', 'Mobile Application']],
    },
    {
      label: 'SERVICES', built: false,
      nodes: [['server', 'Backend / API'], ['database', 'Database'], ['brain', 'AI Vision Service']],
    },
    {
      label: 'CONNECTIVITY', built: false,
      nodes: [['radio-tower', 'IoT Gateway'], ['wifi', 'MQTT / WebSocket']],
    },
    {
      label: 'DEVICE', built: false,
      nodes: [
        ['cpu', 'ESP32'], ['nfc', 'RFID Reader'], ['gauge', 'Sensors'],
        ['camera', 'Camera'], ['cog', 'Actuators'], ['factory', 'Waste Processing'],
      ],
    },
  ]

  const rowH = 0.94
  const rowGap = 0.17
  const y0 = 1.85
  const labelW = 1.62
  const zoneX = M.l + labelW + 0.24
  const zoneW = CW - labelW - 0.24

  rows.forEach((row, ri) => {
    const y = y0 + (rowH + rowGap) * ri

    s.addText(row.label, {
      x: M.l, y, w: labelW, h: rowH, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 10, bold: true, charSpacing: 1.6,
      color: row.built ? C.mint : C.pale, transparency: row.built ? 0 : 40,
    })

    s.addShape(pres.ShapeType.roundRect, {
      x: zoneX, y, w: zoneW, h: rowH, rectRadius: 0.16,
      fill: { color: row.built ? '134632' : C.white, transparency: row.built ? 0 : 92 },
      line: { color: row.built ? C.mid : C.pale, width: row.built ? 1.1 : 0.75, dashType: row.built ? 'solid' : 'dash' },
    })

    const n = row.nodes.length
    const gap = 0.18
    const nw = (zoneW - 0.44 - gap * (n - 1)) / n
    row.nodes.forEach(([ic, label], i) => {
      const nx = zoneX + 0.22 + (nw + gap) * i
      s.addShape(pres.ShapeType.roundRect, {
        x: nx, y: y + 0.16, w: nw, h: rowH - 0.32, rectRadius: 0.12,
        fill: { color: row.built ? C.mint : C.white, transparency: row.built ? 0 : 88 },
        line: { type: 'none' },
      })
      s.addImage({
        path: ICON(ic, row.built ? 'dark' : 'mint'),
        x: nx + 0.16, y: y + rowH / 2 - 0.14, w: 0.28, h: 0.28,
      })
      s.addText(label, {
        x: nx + 0.52, y: y + 0.16, w: nw - 0.66, h: rowH - 0.32, isTextBox: true, margin: 0, valign: 'middle',
        fontFace: F, fontSize: n > 4 ? 10 : 12, bold: true,
        color: row.built ? C.deepest : C.white,
      })
      if (i < n - 1) {
        s.addImage({
          path: ICON('chevron-right', row.built ? 'dark' : 'mint'),
          x: nx + nw + gap / 2 - 0.09, y: y + rowH / 2 - 0.09, w: 0.18, h: 0.18,
        })
      }
    })

    if (ri < rows.length - 1) {
      s.addShape(pres.ShapeType.line, {
        x: zoneX + 0.6, y: y + rowH, w: 0, h: rowGap,
        line: { color: C.mid, width: 1.2, dashType: 'dash' },
      })
    }
  })

  // legend
  const ly = 6.42
  s.addShape(pres.ShapeType.roundRect, {
    x: M.l, y: ly, w: 0.3, h: 0.18, rectRadius: 0.06, fill: { color: C.mint }, line: { type: 'none' },
  })
  s.addText('Built — running in the prototype today', {
    x: M.l + 0.42, y: ly - 0.06, w: 4, h: 0.3, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 10.5, color: C.pale,
  })
  s.addShape(pres.ShapeType.roundRect, {
    x: 5.1, y: ly, w: 0.3, h: 0.18, rectRadius: 0.06,
    fill: { color: C.white, transparency: 88 }, line: { color: C.pale, width: 0.75, dashType: 'dash' },
  })
  s.addText('Proposed — planned for later phases', {
    x: 5.52, y: ly - 0.06, w: 4.4, h: 0.3, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 10.5, color: C.pale, transparency: 25,
  })

  footer(s, 9, true)
  s.addNotes(
    'Only the top layer exists today. Everything below the presentation row is proposed. We designed the app ' +
      'against a service layer so those rows can be filled in without redesigning any screen.',
  )
}

/* =====================================================================
   10 — HARDWARE + SOFTWARE INTEGRATION
   ===================================================================== */
{
  const s = pres.addSlide()
  lightBg(s)
  eyebrow(s, M.l, M.top + 0.1, '10', 'HARDWARE + SOFTWARE')

  s.addText('Every physical action creates a digital event.', {
    x: M.l, y: 1.08, w: 9.4, h: 0.62, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: C.ink,
  })

  const colW = 4.2
  const leftX = M.l
  const rightX = 13.333 - M.r - colW

  s.addText('PHYSICAL WORLD', {
    x: leftX, y: 2.02, w: colW, h: 0.28, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 10, bold: true, charSpacing: 2, color: C.ink40,
  })
  s.addText('DIGITAL WORLD', {
    x: rightX, y: 2.02, w: colW, h: 0.28, isTextBox: true, margin: 0, valign: 'middle', align: 'right',
    fontFace: F, fontSize: 10, bold: true, charSpacing: 2, color: C.green,
  })

  const pairs = [
    ['nfc', 'RFID Reader', 'User Identification'],
    ['weight', 'Weight Sensor', 'Waste Weight'],
    ['gauge', 'Fill Sensor', 'Bin Status'],
    ['camera', 'Camera', 'AI Classification'],
    ['cog', 'Servo / Motor', 'Sorting Command'],
    ['cpu', 'Processing Unit', 'Processing Status'],
  ]

  const rh = 0.56
  const rgap = 0.11
  const ry0 = 2.36

  pairs.forEach(([ic, phys, digi], i) => {
    const y = ry0 + (rh + rgap) * i

    card(s, { x: leftX, y, w: colW, h: rh, radius: 0.13 })
    iconCircle(s, { cx: leftX + 0.42, cy: y + rh / 2, d: 0.4, bg: C.canvas, icon: ic, tone: 'ink', iconScale: 0.5 })
    s.addText(phys, {
      x: leftX + 0.72, y, w: colW - 0.9, h: rh, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 12.5, bold: true, color: C.ink70,
    })

    s.addShape(pres.ShapeType.roundRect, {
      x: rightX, y, w: colW, h: rh, rectRadius: 0.13,
      fill: { color: C.tintBg }, line: { color: C.wash, width: 0.75 },
    })
    s.addText(digi, {
      x: rightX + 0.28, y, w: colW - 0.56, h: rh, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 12.5, bold: true, color: C.deep,
    })

    const lx = leftX + colW
    const lw = rightX - lx
    s.addShape(pres.ShapeType.line, {
      x: lx + 0.16, y: y + rh / 2, w: lw - 0.32, h: 0,
      line: { color: C.pale, width: 1.1, dashType: 'dash' },
    })
    s.addImage({
      path: ICON('arrow-right', 'green'),
      x: lx + lw / 2 - 0.13, y: y + rh / 2 - 0.13, w: 0.26, h: 0.26,
    })
  })

  s.addText(
    'In the current prototype these six events are produced by a built-in Smart Bin Simulator, so the app already consumes them in the exact shape the hardware will send.',
    {
      x: M.l, y: 6.46, w: CW, h: 0.36, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 11.5, italic: true, color: C.ink40,
    },
  )

  footer(s, 10)
  s.addNotes(
    'This mapping is the contract between the two halves of the project. The app already handles all six ' +
      'event types; the hardware team only has to emit them.',
  )
}

/* =====================================================================
   11 — DEVELOPMENT ROADMAP
   ===================================================================== */
{
  const s = pres.addSlide()
  s.background = { color: C.canvas }
  eyebrow(s, M.l, M.top + 0.1, '11', 'DEVELOPMENT ROADMAP')

  s.addText('From prototype to working system.', {
    x: M.l, y: 1.08, w: 8, h: 0.62, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: C.ink,
  })
  s.addText('One of six phases complete.', {
    x: 9.0, y: 1.2, w: 3.58, h: 0.4, isTextBox: true, margin: 0, align: 'right',
    fontFace: F, fontSize: 12.5, bold: true, color: C.green,
  })

  const phases = [
    ['UI / UX Prototype', 'Full mobile app on mock data, with the complete deposit journey.', true],
    ['AI Integration', 'A hosted vision model returns real waste classifications.', false],
    ['Backend + Database', 'Accounts, transactions and rewards persisted server-side.', false],
    ['ESP32 + RFID + Sensors', 'Real identification, weight and fill-level readings.', false],
    ['Waste Processing Rig', 'A physical prototype that sorts and processes the waste.', false],
    ['Complete IoT Integration', 'Live bin telemetry flowing end to end into the app.', false],
  ]

  const gap = 0.2
  const cw = (CW - gap * (phases.length - 1)) / phases.length
  const markY = 2.5
  const md = 0.56

  // rail
  s.addShape(pres.ShapeType.line, {
    x: M.l + cw / 2, y: markY + md / 2, w: CW - cw, h: 0, line: { color: C.line, width: 2 },
  })
  s.addShape(pres.ShapeType.line, {
    x: M.l + cw / 2, y: markY + md / 2, w: cw + gap, h: 0, line: { color: C.mid, width: 2.5 },
  })

  phases.forEach(([title, body, done], i) => {
    const x = M.l + (cw + gap) * i
    const cx = x + cw / 2

    s.addText(`PHASE ${String(i + 1).padStart(2, '0')}`, {
      x, y: 2.06, w: cw, h: 0.26, isTextBox: true, margin: 0, align: 'center', valign: 'middle',
      fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.6,
      color: done ? C.green : C.ink40,
    })

    s.addShape(pres.ShapeType.ellipse, {
      x: cx - md / 2 - 0.1, y: markY - 0.1, w: md + 0.2, h: md + 0.2,
      fill: { color: C.canvas }, line: { type: 'none' },
    })
    s.addShape(pres.ShapeType.ellipse, {
      x: cx - md / 2, y: markY, w: md, h: md,
      fill: { color: done ? C.green : C.white },
      line: done ? { type: 'none' } : { color: C.line, width: 1.4 },
    })
    if (done) {
      s.addImage({ path: ICON('check', 'white'), x: cx - 0.15, y: markY + md / 2 - 0.15, w: 0.3, h: 0.3 })
    } else {
      s.addText(String(i + 1), {
        x: cx - md / 2, y: markY, w: md, h: md, isTextBox: true, margin: 0, align: 'center', valign: 'middle',
        fontFace: F, fontSize: 13, bold: true, color: C.ink40,
      })
    }

    const cy = 3.42
    card(s, {
      x, y: cy, w: cw, h: 2.5,
      fill: done ? C.deep : C.white,
      line: done ? null : C.line,
    })
    s.addText(title, {
      x: x + 0.24, y: cy + 0.26, w: cw - 0.48, h: 0.76, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 14, bold: true, color: done ? C.white : C.ink, lineSpacingMultiple: 1.05,
    })
    s.addText(body, {
      x: x + 0.24, y: cy + 1.02, w: cw - 0.48, h: 1.0, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10.5, color: done ? C.pale : C.ink50, lineSpacingMultiple: 1.18,
    })
    pill(s, {
      x: x + 0.24, y: cy + 2.02, w: 1.05, h: 0.28, size: 8.5,
      text: done ? 'COMPLETE' : 'PLANNED',
      fg: done ? C.deep : C.ink40,
      bg: done ? C.mint : 'EDF1EF',
    })
  })

  s.addText(
    'Phase 01 is finished and demonstrable today. Phases 02 to 06 are scoped but not yet implemented.',
    {
      x: M.l, y: 6.28, w: CW, h: 0.34, isTextBox: true, margin: 0, valign: 'middle',
      fontFace: F, fontSize: 11.5, italic: true, color: C.ink40,
    },
  )

  footer(s, 11)
  s.addNotes(
    'We are honest about where we are. Phase one is done and you can use it right now. The remaining five ' +
      'phases are planned, in this order, because each one unblocks the next.',
  )
}

/* =====================================================================
   12 — CLOSING
   ===================================================================== */
{
  const s = pres.addSlide()
  darkBg(s, A('bg-forest.jpg'))

  s.addImage({ path: ICON('leaf', 'mint'), x: M.l, y: 0.78, w: 0.42, h: 0.42 })
  s.addText('ENGO', {
    x: M.l + 0.54, y: 0.76, w: 3, h: 0.46, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 25, bold: true, charSpacing: 3, color: C.white,
  })

  s.addText('A smarter way to manage waste.', {
    x: M.l, y: 2.3, w: 7.3, h: 1.85, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 50, bold: true, color: C.white, lineSpacingMultiple: 0.97,
  })

  // One paragraph of runs, so the separators space themselves evenly.
  const words = ['IDENTIFY', 'MEASURE', 'ANALYZE', 'REWARD']
  const runs = []
  words.forEach((word, i) => {
    runs.push({ text: word, options: { color: C.mint, bold: true, charSpacing: 2 } })
    if (i < words.length - 1) {
      runs.push({ text: '   ×   ', options: { color: '5E8C74', bold: true } })
    }
  })
  s.addText(runs, {
    x: M.l, y: 4.34, w: 7.6, h: 0.34, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 12.5,
  })

  s.addShape(pres.ShapeType.line, { x: M.l, y: 4.98, w: 1.1, h: 0, line: { color: C.mint, width: 2 } })

  s.addText('Small Actions. A Cleaner Tomorrow.', {
    x: M.l, y: 5.2, w: 7, h: 0.44, isTextBox: true, margin: 0, valign: 'middle',
    fontFace: F, fontSize: 19, bold: true, color: C.wash,
  })
  s.addText(
    'A working frontend prototype today — with a clear, staged path to live AI, a backend and real smart-bin hardware.',
    {
      x: M.l, y: 5.72, w: 6.9, h: 0.7, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 12.5, color: C.pale, transparency: 22, lineSpacingMultiple: 1.25,
    },
  )

  const ph = 7.34
  s.addImage({
    path: PHONE('result-tall'), x: 8.72, y: 0.08, w: phoneW(ph, 'result-tall'), h: ph,
  })

  footer(s, 12, true)
  s.addNotes(
    'Identify, measure, analyze, reward. That is the whole system in four words. Thank you — happy to run ' +
      'the live demo or take questions.',
  )
}

const out = path.join(ROOT, 'deck', 'ENGO-Smart-Waste-Management.pptx')
await pres.writeFile({ fileName: out })
console.log('wrote', path.relative(ROOT, out))
