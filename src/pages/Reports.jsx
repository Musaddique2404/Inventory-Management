import { PageHeader } from '../components/layout/index.js'
import { Badge, Button, Card, List, ListRow, SectionHeader, StatCard, Table } from '../components/ui/index.js'
import { useToast } from '../context/ToastContext.jsx'
import {
  WEEK_INVOICES,
  branches,
  products,
  topProducts,
  weeklyByPayment,
  weeklyByShop,
  weeklySales,
} from '../data/mockData.js'
import { formatMoney, formatMoneyShort, formatNumber } from '../lib/format.js'
import {
  VAT_RATE,
  branchById,
  lowStockAt,
  productById,
  stockValueAt,
  unitsAt,
} from '../lib/stock.js'

/**
 * Sales per day as thin single-hue columns — one series, so no legend; the
 * card title names it. Each column shows its value on hover or focus, and
 * carries it in its accessible name.
 */
function WeeklyBars({ data }) {
  const top = Math.ceil(Math.max(...data.map((d) => d.total)) / 2000) * 2000
  const ticks = [top, top / 2, 0]

  return (
    <div className="pl-10">
      <div className="relative h-80">
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-line-soft" style={{ top: `${(1 - t / top) * 100}%` }}>
            <span className="absolute -left-10 w-8 -translate-y-1/2 text-right text-[11px] text-muted tabular-nums">
              {t / 1000}k
            </span>
          </div>
        ))}

        <div className="relative flex h-full items-end gap-2 sm:gap-4">
          {data.map((d) => {
            const pct = (d.total / top) * 100
            return (
              <div
                key={d.day}
                tabIndex={0}
                role="img"
                aria-label={`${d.day}: ${formatMoney(d.total)}`}
                className="group relative flex h-full flex-1 items-end justify-center outline-none"
              >
                <div
                  className="w-full max-w-9 rounded-t-[4px] bg-brand-600 transition group-hover:bg-brand-800 group-focus-visible:bg-brand-800"
                  style={{ height: `${pct}%` }}
                />
                <span
                  className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-lg bg-deep px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-on-brand-light opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ bottom: `calc(${pct}% + 8px)` }}
                >
                  {formatMoney(d.total)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-2 flex gap-2 sm:gap-4">
        {data.map((d) => (
          <span key={d.day} className="flex-1 text-center text-[11px] text-muted">
            {d.day}
          </span>
        ))}
      </div>
    </div>
  )
}

/** A labelled single-hue bar — share of the week for one shop or one payment method. */
function ShareRow({ label, value, max, total }) {
  return (
    <div className="py-2.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-muted tabular-nums">
          {formatMoney(value)} · {Math.round((value / total) * 100)}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  )
}

const EXPORTS = [
  { key: 'sales', icon: 'receipt', title: 'Sales by invoice', detail: 'Every invoice with VAT, last 7 days', format: 'CSV' },
  { key: 'stock', icon: 'box', title: 'Stock valuation', detail: 'Units and value per product per branch', format: 'XLSX' },
  { key: 'vat', icon: 'percent', title: 'VAT summary', detail: 'Output VAT by shop, for the ZATCA return', format: 'PDF' },
]

export default function Reports() {
  const { toast } = useToast()
  const net = weeklySales.reduce((sum, d) => sum + d.total, 0)
  const sample = () => toast('Sample only — exports aren’t generated in this prototype.', 'warn')

  const stockRows = branches.map((b) => ({
    id: b.id,
    name: b.name,
    units: unitsAt(b.id),
    cost: stockValueAt(b.id),
    retail: products.reduce((sum, p) => sum + (p.stock[b.id] ?? 0) * p.price, 0),
    low: lowStockAt(b.id).length,
  }))

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Last 7 days · Saturday 3 – Friday 9 October 2026"
        action={
          <Button variant="outline" icon="download" onClick={sample} className="max-sm:hidden">
            Export
          </Button>
        }
      />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeader title="Sales summary" className="mb-3" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Net sales" icon="trendUp" value={formatMoneyShort(net)}>
              <p className="text-sm text-muted">before VAT</p>
            </StatCard>
            <StatCard label="VAT collected" icon="percent" value={formatMoneyShort(net * VAT_RATE)}>
              <p className="text-sm text-muted">15% output VAT</p>
            </StatCard>
            <StatCard label="Invoices" icon="receipt" value={formatNumber(WEEK_INVOICES)}>
              <p className="text-sm text-muted">across 3 shops</p>
            </StatCard>
            <StatCard label="Average sale" icon="tag" value={formatMoney(net / WEEK_INVOICES)}>
              <p className="text-sm text-muted">per invoice, net</p>
            </StatCard>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_22rem]">
            <Card padding="lg">
              <div className="mb-6 flex items-baseline justify-between gap-3">
                <p className="text-[15px] font-bold text-ink">Net sales per day</p>
                <p className="text-sm text-muted">{formatMoney(net)}</p>
              </div>
              <WeeklyBars data={weeklySales} />
            </Card>

            <Card padding="lg" className="flex flex-col gap-6">
              <div>
                <p className="text-[15px] font-bold text-ink">By shop</p>
                <div className="mt-2">
                  {weeklyByShop.map((s) => (
                    <ShareRow key={s.branchId} label={branchById(s.branchId).name} value={s.total} max={weeklyByShop[0].total} total={net} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[15px] font-bold text-ink">By payment method</p>
                <div className="mt-2">
                  {weeklyByPayment.map((p) => (
                    <ShareRow key={p.method} label={p.method} value={p.total} max={weeklyByPayment[0].total} total={net} />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeader title="Top sellers" className="mb-3" />
          <Table
            rowKey={(row) => row.productId}
            rows={topProducts}
            columns={[
              { key: 'rank', label: '#', render: (row) => <span className="text-muted">{topProducts.indexOf(row) + 1}</span> },
              {
                key: 'product',
                label: 'Product',
                render: (row) => <span className="font-semibold">{productById(row.productId).name}</span>,
              },
              { key: 'sku', label: 'SKU', render: (row) => <span className="text-muted">{productById(row.productId).sku}</span> },
              { key: 'units', label: 'Units sold', align: 'right', render: (row) => formatNumber(row.units) },
              {
                key: 'sales',
                label: 'Net sales',
                align: 'right',
                render: (row) => <span className="font-semibold">{formatMoney(row.units * productById(row.productId).price)}</span>,
              },
            ]}
          />
        </section>

        <section>
          <SectionHeader title="Stock per branch" className="mb-3" />
          <Table
            rows={stockRows}
            columns={[
              { key: 'name', label: 'Branch', render: (row) => <span className="font-semibold">{row.name}</span> },
              { key: 'units', label: 'Units', align: 'right', render: (row) => formatNumber(row.units) },
              { key: 'cost', label: 'Value at cost', align: 'right', render: (row) => formatMoney(row.cost) },
              { key: 'retail', label: 'Value at sale price', align: 'right', render: (row) => formatMoney(row.retail) },
              {
                key: 'low',
                label: 'Low items',
                align: 'right',
                render: (row) =>
                  row.low > 0 ? (
                    <Badge tone="danger" size="sm">
                      {row.low} low
                    </Badge>
                  ) : (
                    <span className="text-muted">—</span>
                  ),
              },
            ]}
          />
        </section>

        <section>
          <SectionHeader title="Export" className="mb-3" />
          <List>
            {EXPORTS.map((e) => (
              <ListRow
                key={e.key}
                icon={e.icon}
                tone="brand"
                title={e.title}
                subtitle={e.detail}
                trailing={
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge size="sm">{e.format}</Badge>
                    <Button variant="outline" size="sm" icon="download" onClick={sample}>
                      Download
                    </Button>
                  </div>
                }
              />
            ))}
          </List>
        </section>
      </div>
    </>
  )
}
