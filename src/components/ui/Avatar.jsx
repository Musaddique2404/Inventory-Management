import { cx } from '../../lib/cx.js'

const TONES = {
  /* A 700→900 sweep down the ramp. White initials hold 7.1:1 at the
     lightest point and climb from there. */
  brand: 'bg-gradient-to-br from-brand-700 to-brand-900 text-white',
  /* For the sidebar, which is a brand-700 panel — a ramp-step fill there
     would either vanish into the panel or gradient down into it. A
     translucent white wash instead, so the disc lifts off whatever it sits on. */
  deep: 'bg-white/20 text-white',
}

const SIZES = {
  sm: 'size-9 text-xs',
  md: 'size-10.5 text-[13px]',
  lg: 'size-18 text-2xl',
}

export function Avatar({ initials, size = 'md', tone = 'brand', className }) {
  return (
    <div
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        TONES[tone],
        SIZES[size],
        className,
      )}
    >
      {initials}
    </div>
  )
}
