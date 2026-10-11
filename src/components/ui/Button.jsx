import Icon from '../Icon.jsx'
import { cx } from '../../lib/cx.js'

/* Primary, accent and dark are three genuinely different fills, and press
   states step along the Indigo·Dusk ramp instead of fading opacity.

   Primary carries WHITE on step 700 (#4650A6, 7.10:1) and hovers DARKER, to
   800 (8.96:1) — the label gets easier to read under the pointer, never
   harder. Accent is the light seed (step 400), so it carries deep ink and
   darkens on press: the mirror of primary, moving up the ramp. */
/* Every variant carries a 1px border — transparent on the fills — so a
   filled button and an outlined one sit at the same height in a row. */
const VARIANTS = {
  primary: 'border border-transparent bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
  accent: 'border border-transparent bg-accent text-on-brand-dark hover:bg-accent-hover active:bg-accent-active',
  dark: 'border border-transparent bg-deep text-on-brand-light hover:bg-brand-900 active:bg-brand-800',
  outline: 'border border-line bg-panel text-ink hover:bg-surface',
  ghost: 'border border-transparent text-muted hover:bg-surface hover:text-ink',
  danger: 'border border-transparent bg-danger/10 text-danger hover:bg-danger/16',
  onDark: 'border border-transparent bg-white text-brand-800 hover:bg-brand-50',
  onDarkGhost: 'border border-deep-line text-on-brand-light hover:bg-white/10',
  /* Cancel on a step-950 surface. --danger is tuned for white grounds and
     goes muddy on the deep fill, so the label takes a soft salmon over a
     faint white wash instead. */
  dangerOnDark: 'border border-white/20 bg-white/8 text-[#f6b4af] hover:bg-white/15',
  /* For step-700 surfaces, not step-950 ones. --deep-line is a rule for
     the dark card and nearly vanishes on 700, so white at 45% gives the
     boundary something to be. */
  onBrandGhost: 'border border-white/45 text-white hover:bg-white/15',
}

const SIZES = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-[15px]',
}

/* The chrome every styled variant shares. */
const BASE = cx(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition',
  'disabled:pointer-events-none disabled:opacity-45',
)

/**
 * The kit's button. `variant` picks a styled surface from the table above and
 * `size` its padding.
 *
 * `variant="bare"` renders the <button> with none of that — no base classes,
 * no size — for the one-off controls whose class string the caller owns: a
 * washed row, a rail step, a slot, a text link. The base classes cannot simply
 * be overridden (justify-center is emitted after justify-between, gap-2 after
 * gap-1), so bare skips them outright. It exists so nothing outside ui/ writes
 * a raw <button>; `size` is ignored on it.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  className,
  children,
  type = 'button',
  ...rest
}) {
  const bare = variant === 'bare'

  return (
    <button
      type={type}
      className={cx(
        !bare && BASE,
        !bare && VARIANTS[variant],
        !bare && SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} className="size-4" strokeWidth={2} />}
      {children}
      {iconRight && <Icon name={iconRight} className="size-4" strokeWidth={2} />}
    </button>
  )
}
