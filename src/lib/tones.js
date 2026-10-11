/**
 * The status tone table — one source for every soft-filled status surface
 * (badges, icon tiles, toasts, notification rows).
 *
 * The text hexes are NOT --color-success / --warn / --danger. Those are tuned
 * to carry white as a solid fill; on a 12% wash of themselves over white they
 * fall well under 4.5:1 (success #1fa35d lands at 2.6:1). Each is therefore
 * darkened until the pair clears AA at small-text size:
 *
 *   success  #157345 on success/12   5.9:1
 *   warn     #b06e08 on warn/12      4.9:1
 *   danger   #af2030 on danger/12    6.3:1
 *   brand    brand-800 on brand-100  7.5:1
 *   neutral  --muted on --surface-2  4.7:1
 *
 * Every chip, tile, toast and notification row reads from here, so the
 * tables cannot drift apart.
 */
export const TONES = {
  brand: { fill: 'bg-brand-100', text: 'text-brand-800', border: 'border-brand-200' },
  neutral: { fill: 'bg-surface-2', text: 'text-muted', border: 'border-line' },
  success: { fill: 'bg-success/12', text: 'text-[#157345]', border: 'border-success/35' },
  warn: { fill: 'bg-warn/12', text: 'text-[#b06e08]', border: 'border-warn/35' },
  danger: { fill: 'bg-danger/12', text: 'text-[#af2030]', border: 'border-danger/35' },
}

/**
 * Softer tone surfaces, for washing a whole card rather than a chip.
 *
 * TONES above is tuned for IconTiles — a 12% fill reads right on a 38px square.
 * Behind an entire stat card that same wash shouts, so these sit at ~8%: a tint
 * the card wears, not a status flag. The paired border runs a touch stronger so
 * the card still reads as outlined against the white canvas. brand takes solid
 * ramp steps (50 / 200) because it has real tokens where the status hues don't.
 */
export const CARD_TONE = {
  brand: 'bg-brand-50 border-brand-200',
  neutral: 'bg-surface border-line',
  success: 'bg-success/8 border-success/30',
  warn: 'bg-warn/8 border-warn/30',
  danger: 'bg-danger/8 border-danger/30',
}

/**
 * Deep tone fills for the `filled` StatCard — a saturated dark surface per hue,
 * each carrying white text at AA. brand and neutral are real ramp steps (700 →
 * 7.1:1, 950 → 15.9:1). warn and success have no dark step in the ramp, so
 * these are those hues darkened until white clears: amber #985f0d (5.28:1) and
 * green #1a7d47 (5.16:1).
 */
export const CARD_FILL = {
  brand: 'border-brand-700 bg-brand-700',
  warn: 'border-[#985f0d] bg-[#985f0d]',
  success: 'border-[#1a7d47] bg-[#1a7d47]',
  neutral: 'border-brand-950 bg-brand-950',
}

/**
 * The faintest tone surfaces, for status-washed list rows — lighter again than
 * CARD_TONE, since a row is a thin band and even an 8% wash stacks up down a
 * list. Each pairs a resting wash with a one-step-deeper hover. brand takes the
 * ramp's own 50/100 steps; the status hues use a 6→12% wash.
 */
export const ROW_WASH = {
  brand: 'bg-brand-50 hover:bg-brand-100',
  neutral: 'bg-surface hover:bg-surface-2',
  success: 'bg-success/6 hover:bg-success/12',
  warn: 'bg-warn/6 hover:bg-warn/12',
  danger: 'bg-danger/6 hover:bg-danger/12',
}

/** Solid dots, for when colour is the only thing carrying the status. */
export const TONE_DOT = {
  brand: 'bg-brand-700',
  neutral: 'bg-faint',
  success: 'bg-success',
  warn: 'bg-warn',
  danger: 'bg-danger',
}

/**
 * Document status → tone. Lives in one place so a Received stock-in and a
 * Delivered transfer read the same green on every page.
 */
export const STATUS_TONE = {
  Received: 'success',
  Delivered: 'success',
  Paid: 'success',
  'In transit': 'warn',
  Pending: 'warn',
  Draft: 'neutral',
  Cancelled: 'danger',
}

/** Adjustment type → tone: damage is a loss, a return puts stock back, a count fix is neutral. */
export const ADJUSTMENT_TONE = {
  Damaged: 'danger',
  Return: 'success',
  'Count fix': 'brand',
}
