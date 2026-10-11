import { useNavigate } from 'react-router-dom'
import { Button, SectionHeader, TimelineRow, cx } from '../ui/index.js'
import { TODAY, adjustments, sales, stockIns, transfers } from '../../data/mockData.js'
import { formatMoney, formatRelativeDay, formatTime } from '../../lib/format.js'
import { ROUTES } from '../../lib/nav.js'
import { TONES } from '../../lib/tones.js'
import { branchById, costTotal, productById, saleTotals, units } from '../../lib/stock.js'

/** The last few documents of any kind, newest first, each opening its record. */
export function RecentActivity() {
  const navigate = useNavigate()

  const events = [
    ...sales.map((s) => ({
      key: s.id,
      at: s.at,
      kind: 'Sale',
      tone: 'success',
      bar: 'bg-success/40',
      title: `${s.id} · ${formatMoney(saleTotals(s.items).total)}`,
      detail: `${branchById(s.branchId).name} · ${s.customer.name}`,
      to: `${ROUTES.sales}/${s.id}`,
    })),
    ...transfers.map((t) => ({
      key: t.id,
      at: t.at,
      kind: 'Transfer',
      tone: 'brand',
      bar: 'bg-brand-300',
      title: `${t.id} · ${units(t.items)} units`,
      detail: `Main → ${branchById(t.shopId).name}`,
      to: `${ROUTES.transfers}/${t.id}`,
    })),
    ...stockIns.map((d) => ({
      key: d.id,
      at: d.at,
      kind: 'Stock in',
      tone: 'neutral',
      bar: 'bg-line',
      title: `${d.id} · ${formatMoney(costTotal(d.items))}`,
      detail: `${d.supplier} → Main`,
      to: ROUTES.stockIn,
    })),
    ...adjustments.map((a) => ({
      key: a.id,
      at: a.at,
      kind: a.type,
      tone: 'warn',
      bar: 'bg-warn/40',
      title: `${a.id} · ${a.qty > 0 ? '+' : ''}${a.qty} ${productById(a.productId).name}`,
      detail: branchById(a.branchId).name,
      to: ROUTES.adjustments,
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 7)

  return (
    <section>
      <SectionHeader title="Recent activity" className="mb-4" />
      <ul className="flex flex-col gap-6">
        {events.map((e) => (
          <TimelineRow key={e.key} time={formatTime(e.at)} day={formatRelativeDay(e.at, TODAY)} bar={e.bar}>
            <Button
              variant="bare"
              onClick={() => navigate(e.to)}
              className="group flex w-full items-center justify-between gap-4 pt-0.5 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-[15px] leading-tight font-bold text-ink transition-colors group-hover:text-brand-700">
                  {e.title}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-muted">{e.detail}</span>
              </span>
              <span className={cx('shrink-0 text-[13px] font-semibold', TONES[e.tone].text)}>{e.kind}</span>
            </Button>
          </TimelineRow>
        ))}
      </ul>
    </section>
  )
}
