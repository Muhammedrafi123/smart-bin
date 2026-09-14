export const kg = (v: number) => `${v.toFixed(2)} kg`
export const inr = (v: number) => `₹${v.toFixed(0)}`
export const pts = (v: number) => `${v > 0 ? '+' : ''}${v} pts`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const shortDate = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]}`
}

export const longDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export const time = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

/** "Today · 10:42 AM" / "14 Sep · 10:42 AM" */
export const stamp = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const yesterday = new Date(now.getTime() - 864e5).toDateString() === d.toDateString()
  const label = sameDay ? 'Today' : yesterday ? 'Yesterday' : shortDate(iso)
  return `${label} · ${time(iso)}`
}

export const relative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 6e4)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  if (days < 7) return `${days}d ago`
  return shortDate(iso)
}

export const greeting = (d = new Date()) => {
  const h = d.getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export const firstName = (name: string) => name.split(' ')[0]
