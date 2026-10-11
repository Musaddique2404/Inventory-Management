import { useNavigate } from 'react-router-dom'
import { Button, SectionHeader, cx } from '../ui/index.js'
import { branches, products, transfers } from '../../data/mockData.js'
import { ROUTES } from '../../lib/nav.js'
import { ROW_WASH, TONE_DOT, TONES } from '../../lib/tones.js'
import { branchById, isLowAt, minFor } from '../../lib/stock.js'

/**
 * Every open loop, gathered: each product under its reorder level at each
 * branch, most urgent first, then anything still on the road. A shop row's
 * action sends stock from Main; a warehouse row's action is a delivery.
 *
 * Beside Stock per branch (xl+) the list is laid out absolutely inside the
 * section, so it adds nothing to the row's height: the row takes the stock
 * cards' height, the section stretches to it, and the alerts scroll within.
 */
export function StockAlerts() {
  const navigate = useNavigate()

  const low = branches
    .flatMap((b) => products.filter((p) => isLowAt(p, b.id)).map((p) => ({ b, p })))
    .sort((x, y) => x.p.stock[x.b.id] / minFor(x.p, x.b.id) - y.p.stock[y.b.id] / minFor(y.p, y.b.id))
    .map(({ b, p }) => ({
      key: `${b.id}-${p.id}`,
      tone: 'danger',
      title: p.name,
      detail: `${p.stock[b.id]} left ${b.type === 'warehouse' ? 'in Main' : `at ${b.name}`} · min ${minFor(p, b.id)}`,
      action: b.type === 'warehouse' ? 'Stock in' : 'Send stock',
      to: b.type === 'warehouse' ? ROUTES.newStockIn : `${ROUTES.newTransfer}?shop=${b.id}&product=${p.id}`,
    }))

  const moving = transfers
    .filter((t) => t.status === 'In transit')
    .map((t) => ({
      key: t.id,
      tone: 'warn',
      title: `${t.id} on its way`,
      detail: `to ${branchById(t.shopId).name}`,
      action: 'Open',
      to: `${ROUTES.transfers}/${t.id}`,
    }))

  const items = [...low, ...moving]

  return (
    <section className="relative">
      <div className="flex flex-col xl:absolute xl:inset-0">
        <SectionHeader title="Alerts" count={items.length} className="mb-3" />
        <div className="scrollbar-slim grid min-h-0 flex-1 content-start gap-2.5 xl:overflow-y-auto">
          {items.map((item) => (
            <Button
              key={item.key}
              variant="bare"
              onClick={() => navigate(item.to)}
              className={cx(
                'flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-3.5 text-left transition',
                ROW_WASH[item.tone],
              )}
            >
              <span className="flex min-w-0 items-center gap-3.5">
                <span className={cx('size-2 shrink-0 rounded-full', TONE_DOT[item.tone])} />
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-ink">{item.title}</span>
                  <span className="block truncate text-[13px] text-muted">{item.detail}</span>
                </span>
              </span>
              <span className={cx('shrink-0 text-sm font-semibold', TONES[item.tone].text)}>{item.action}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
