import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/index.js'
import { shops } from '../../data/mockData.js'
import { formatMoney } from '../../lib/format.js'
import { ROUTES } from '../../lib/nav.js'
import { saleTotals, salesToday, salesTodayAt } from '../../lib/stock.js'

/**
 * The dark hero — today's takings as a headline, not a stat tile. Same
 * gradient across the deep end of the ramp the portal's next-session hero
 * wears; the New sale button takes the accent seed, the one brand value bright
 * enough to read as *the* action on a dark ground.
 */
export function SalesHero() {
  const navigate = useNavigate()
  const { total, vat } = salesToday.reduce(
    (sum, sale) => {
      const t = saleTotals(sale.items)
      return { total: sum.total + t.total, vat: sum.vat + t.vat }
    },
    { total: 0, vat: 0 },
  )

  return (
    <section className="rounded-3xl bg-gradient-to-br from-deep to-brand-900 px-7 py-7 sm:px-9 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-6">
        <div>
          <p className="eyebrow text-deep-muted">Sales today</p>
          <h2 className="mt-2.5 text-[32px] leading-tight font-bold tracking-tight text-on-brand-light sm:text-[38px]">
            {formatMoney(total)}
            <span className="ml-2.5 align-middle text-sm font-semibold text-deep-muted">incl. VAT</span>
          </h2>
          <p className="mt-2 text-[13px] text-deep-muted">
            {salesToday.length} invoices across {shops.length} shops · VAT collected {formatMoney(vat)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="accent" icon="plus" onClick={() => navigate(ROUTES.newSale)}>
            New sale
          </Button>
          <Button variant="onDarkGhost" onClick={() => navigate(ROUTES.sales)}>
            View sales
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-deep-line pt-5 sm:grid-cols-3">
        {shops.map((shop) => (
          <Button
            key={shop.id}
            variant="bare"
            onClick={() => navigate(`${ROUTES.shops}/${shop.id}`)}
            className="group text-left focus-visible:outline-white"
          >
            <span className="block text-[13px] text-deep-muted transition group-hover:text-on-brand-light">{shop.name}</span>
            <span className="mt-0.5 block text-lg font-bold text-on-brand-light tabular-nums">
              {formatMoney(salesTodayAt(shop.id))}
            </span>
          </Button>
        ))}
      </div>
    </section>
  )
}
