import { Card } from '../ui/index.js'

/**
 * The sticky totals aside on the New sale and New transfer forms — figures,
 * the headline total, and the commit button. Same anatomy as the portal's
 * bank-transfer card: eyebrow, ruled rows, a 22px total, a full-width action.
 *
 * `children` sits between the eyebrow and the rows, for a control that belongs
 * with the totals (the sale's payment method).
 *
 * Below lg the card stacks under a long form, so the total and the action
 * float in a bar pinned to the bottom of the screen instead (after MeetNPlan's
 * floating wizard footer), and the card's own buttons step aside.
 */
export function SummaryCard({ eyebrow = 'Summary', rows, total, action, caption, children }) {
  return (
    <>
      <Card as="aside" padding="lg" className="h-fit 2xl:sticky 2xl:top-6">
        <p className="eyebrow text-muted">{eyebrow}</p>

        {children}

        <dl className="mt-4">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-line-soft py-2.5 last:border-0">
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="text-sm font-semibold text-ink tabular-nums">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex items-baseline justify-between border-t border-line pt-5">
          <span className="text-sm text-muted">{total.label}</span>
          <span className="text-[22px] leading-none font-bold text-ink tabular-nums">{total.value}</span>
        </div>

        {/* In the 22rem side column (2xl) the buttons run full width, stacked. When
            the card spans the page (lg–2xl) that would be a 1000px button, so
            they sit in a row at their own width, primary on the right. */}
        <div className="mt-5 hidden gap-2.5 lg:flex lg:flex-row-reverse lg:*:w-auto 2xl:flex-col 2xl:*:w-full">{action}</div>
        {caption && <p className="mt-3 text-center text-xs text-muted lg:text-right 2xl:text-center">{caption}</p>}
      </Card>

      <div className="fixed inset-x-3 bottom-3 z-30 rounded-[18px] bg-panel p-3 shadow-[0_0_0_1px_var(--line),0_12px_28px_-12px_rgba(28,31,64,0.28)] lg:hidden print:hidden">
        <div className="flex items-baseline justify-between px-1 pb-2.5">
          <span className="text-sm text-muted">{total.label}</span>
          <span className="text-lg leading-none font-bold text-ink tabular-nums">{total.value}</span>
        </div>
        <div className="flex flex-row-reverse gap-2.5 *:flex-1">{action}</div>
      </div>
      {/* Room under the last card for the bar to sit over. */}
      <div aria-hidden="true" className="h-24 lg:hidden" />
    </>
  )
}
