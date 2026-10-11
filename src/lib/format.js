const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** "Fri 09 Oct" */
export function formatShort(date) {
  return `${WEEKDAYS_SHORT[date.getDay()]} ${String(date.getDate()).padStart(2, '0')} ${MONTHS_SHORT[date.getMonth()]}`
}

/** "09 Oct 2026" — a document date, where the year matters and the weekday doesn't. */
export function formatMedium(date) {
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`
}

/** "Friday, 9 October 2026" — the dateline under a page title. */
export function formatLong(date) {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** "11:42 AM" */
export function formatTime(date) {
  const h = date.getHours()
  return `${h % 12 === 0 ? 12 : h % 12}:${String(date.getMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

/** "Today" / "Yesterday", falling back to formatShort. `from` is the fixtures' pinned TODAY. */
export function formatRelativeDay(date, from) {
  const days = Math.round((startOfDay(from) - startOfDay(date)) / 864e5)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return formatShort(date)
}

/** "2026-10-09" — the value a native date input takes. */
export function toInputDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * "SAR 1,234.50" — always two decimals. Unlike session prices, shelf prices and
 * unit costs carry halalas, so the decimals are real precision, not noise.
 */
export function formatMoney(amount) {
  return `SAR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** "SAR 48.2k" — a figure in a 34px stat tile, where the full amount would wrap. */
export function formatMoneyShort(amount) {
  if (amount < 1000) return formatMoney(amount)
  return `SAR ${(amount / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}k`
}

/** "1,240" */
export function formatNumber(n) {
  return n.toLocaleString('en-US')
}

export function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}
