import { useState } from 'react'
import Icon from '../Icon.jsx'
import { cx } from '../../lib/cx.js'

/**
 * A quantity control: − / typed value / +.
 *
 * The value is clamped to [min, max] on every path in, so a typed "999" on a
 * transfer line cannot send more than the warehouse holds. `max` is optional.
 *
 * While the box has focus it shows a draft string, so clearing it to type a
 * new number doesn't snap back to `min` first (delete "2", type "5" → 5, not
 * 15). The draft is dropped on blur and the clamped value shows again.
 */
export function QtyStepper({ value, onChange, min = 0, max, label = 'Quantity', className }) {
  const [draft, setDraft] = useState(null)
  const set = (n) => onChange(Math.max(min, max == null ? n : Math.min(max, n)))

  const type = (raw) => {
    const n = Math.floor(Number(raw))
    if (raw === '' || !Number.isFinite(n)) return setDraft(raw)
    setDraft(String(max != null && n > max ? max : n))
    set(n)
  }

  const step = 'flex size-8 items-center justify-center text-muted transition hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-35'

  return (
    <div className={cx('inline-flex items-center overflow-hidden rounded-xl border border-line bg-panel', className)}>
      <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => set(value - 1)} className={step}>
        <Icon name="minus" className="size-3.5" strokeWidth={2.2} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={draft ?? value}
        onFocus={() => setDraft(String(value))}
        onChange={(e) => type(e.target.value)}
        onBlur={() => setDraft(null)}
        className="no-spin h-8 w-12 border-x border-line bg-transparent text-center text-sm font-semibold text-ink outline-none focus:bg-tint"
      />
      <button type="button" aria-label={`Increase ${label}`} disabled={max != null && value >= max} onClick={() => set(value + 1)} className={step}>
        <Icon name="plus" className="size-3.5" strokeWidth={2.2} />
      </button>
    </div>
  )
}
