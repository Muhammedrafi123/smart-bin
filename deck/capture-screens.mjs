import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const OUT = process.argv[2] || 'shots'
const BASE = 'http://localhost:5173'
fs.mkdirSync(OUT, { recursive: true })

async function launch() {
  for (const channel of ['msedge', 'chrome', undefined]) {
    try {
      return await chromium.launch({ channel, headless: true })
    } catch (e) {
      console.log(`  (channel ${channel ?? 'bundled'} unavailable)`)
    }
  }
  throw new Error('no browser available')
}

const browser = await launch()
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
})
const page = await ctx.newPage()

const shot = async (name) => {
  await page.waitForTimeout(450)
  await page.screenshot({ path: path.join(OUT, `${name}.png`) })
  console.log('  captured', name)
}

const textHas = (s) =>
  page.waitForFunction(
    (needle) => document.getElementById('root')?.innerText.includes(needle),
    s,
    { timeout: 25000 },
  )

const seed = async (scenario = 'auto', signedIn = true) => {
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' })
  await page.evaluate(
    ([sc, si]) => {
      localStorage.clear()
      if (si) {
        // Sign in directly so captures do not depend on animation timing.
        const raw = { scenario: sc }
        localStorage.setItem('engo.state.v1', JSON.stringify(raw))
      }
    },
    [scenario, signedIn],
  )
  if (signedIn) {
    await page.goto(BASE + '/login', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Demo Login/ }).click()
    await page.waitForURL('**/home', { timeout: 15000 })
    await page.evaluate((sc) => {
      const s = JSON.parse(localStorage.getItem('engo.state.v1') || '{}')
      s.scenario = sc
      localStorage.setItem('engo.state.v1', JSON.stringify(s))
    }, scenario)
  }
}

console.log('01 splash / login / identify')
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await shot('01-splash')

await page.goto(BASE + '/login', { waitUntil: 'networkidle' })
await shot('02-login')

await page.goto(BASE + '/identify', { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
await shot('03-rfid-tap')
await textHas('Welcome Back,')
await page.waitForTimeout(700)
await shot('04-rfid-welcome')

console.log('02 home + sections')
await seed('auto')
await page.waitForTimeout(800)
await shot('05-home')

for (const [route, name] of [
  ['/history', '10-history'],
  ['/rewards', '11-rewards'],
  ['/penalties', '12-penalties'],
  ['/profile', '13-profile'],
  ['/notifications', '14-notifications'],
]) {
  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await shot(name)
}

console.log('03 deposit flow (accepted)')
await seed('accepted')
await page.goto(BASE + '/deposit', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await shot('06-deposit-rfid')
await textHas('Smart bin unlocked')
await shot('07-deposit-unlocked')
await textHas('Waste detected')
await shot('08-deposit-weighing')
await textHas('Analyzing')
await page.waitForTimeout(1750)
await page.screenshot({ path: path.join(OUT, '09-deposit-analyzing.png') })
console.log('  captured 09-deposit-analyzing')
await textHas('Transaction ID')
await page.waitForTimeout(900)
await shot('15-result-accepted')

console.log('04 deposit flow (incorrect)')
await seed('incorrect')
await page.goto(BASE + '/deposit', { waitUntil: 'networkidle' })
await textHas('Transaction ID')
await page.waitForTimeout(900)
await shot('16-result-incorrect')

console.log('05 transaction detail')
const txId = await page.evaluate(
  () => JSON.parse(localStorage.getItem('engo.state.v1')).transactions[0].id,
)
await page.goto(`${BASE}/transaction/${txId}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
await shot('17-transaction-detail')

await browser.close()
console.log('\nDone. Files:')
for (const f of fs.readdirSync(OUT).sort()) {
  const { size } = fs.statSync(path.join(OUT, f))
  console.log(' ', f, (size / 1024).toFixed(0) + 'kB')
}
