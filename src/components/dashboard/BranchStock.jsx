import { Link } from 'react-router-dom'
import { Badge, Card, SectionHeader } from '../ui/index.js'
import { branches, shops } from '../../data/mockData.js'
import { formatMoney, formatNumber } from '../../lib/format.js'
import { ROUTES } from '../../lib/nav.js'
import { lowStockAt, stockValueAt, unitsAt } from '../../lib/stock.js'

const warehouse = branches.find((b) => b.type === 'warehouse')
const total = branches.reduce((sum, b) => sum + unitsAt(b.id), 0)

function figures(id) {
  const units = unitsAt(id)
  return {
    units: formatNumber(units),
    value: formatMoney(stockValueAt(id)),
    share: `${Math.round((units / total) * 100)}%`,
    low: lowStockAt(id).length,
  }
}

/**
 * Units, value and share of all units per location: the warehouse as a wide
 * card on the same deep gradient as the sales hero, then one card per shop
 * with a meter for its share. Every card opens its location — the shops their
 * detail page, the warehouse the product list (it has no page of its own).
 */
export function BranchStock() {
  const main = figures(warehouse.id)

  return (
    <section>
      <SectionHeader title="Stock per branch" className="mb-3" />
      <div className="grid gap-4 tabular-nums min-[560px]:grid-cols-3">
        <Link
          to={ROUTES.products}
          className="flex items-end justify-between gap-4 rounded-2xl bg-gradient-to-br from-deep to-brand-900 p-7 focus-visible:outline-white min-[560px]:col-span-3"
        >
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-deep-muted">{warehouse.name}</p>
            <p className="flex items-baseline gap-1.5">
              <span className="text-[40px] leading-none font-bold text-on-brand-light">{main.units}</span>
              <span className="text-base text-deep-muted">units</span>
            </p>
            <p className="text-[15px] text-brand-200">{main.value}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {main.low > 0 && (
              <span className="rounded-full bg-danger px-2.5 py-0.5 text-[12px] font-semibold text-white">
                {main.low} low
              </span>
            )}
            <p className="text-5xl leading-none font-bold text-accent">{main.share}</p>
          </div>
        </Link>

        {shops.map((shop) => {
          const f = figures(shop.id)
          return (
            <Card
              key={shop.id}
              as={Link}
              to={`${ROUTES.shops}/${shop.id}`}
              padding="none"
              className="flex flex-col gap-4 px-5 py-5 transition-colors hover:border-brand-600"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <p className="text-[15px] font-bold text-ink">{shop.name}</p>
                {f.low > 0 && (
                  <Badge tone="danger" size="sm">
                    {f.low} low
                  </Badge>
                )}
              </div>
              <p className="flex items-baseline gap-1">
                <span className="text-[28px] leading-none font-bold text-ink">{f.units}</span>
                <span className="text-[13px] text-muted">units</span>
              </p>
              <div>
                <div className="h-1.5 overflow-hidden rounded-full bg-brand-100" role="img" aria-label={`${f.share} of all units`}>
                  <div className="h-full rounded-full bg-brand-600" style={{ width: f.share }} />
                </div>
                <div className="mt-1.5 flex justify-between gap-2 text-xs text-muted">
                  <span>{f.value}</span>
                  <span>{f.share}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
