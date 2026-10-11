import { cx } from '../../lib/cx.js'

/* Popovers keep a shadow where the cards no longer do — they float over
   content rather than sitting in the layout, so the border alone would let
   them blend into whatever is behind them. Tightened from 2xl/12% to lg/5%:
   enough to lift, not enough to read as a raised object. */
const POPOVER_SURFACE =
  'absolute right-0 z-40 mt-2 overflow-hidden rounded-2xl border border-line bg-panel shadow-lg shadow-black/5'

/**
 * The floating panel under the bell, the search box and the product pickers.
 * Pair with useDismiss. `width` replaces the default rather than layering on
 * it — two w-* utilities on one element resolve by CSS source order.
 */
export function Popover({ width = 'w-[21rem]', className, children }) {
  return <div className={cx(POPOVER_SURFACE, width, className)}>{children}</div>
}
