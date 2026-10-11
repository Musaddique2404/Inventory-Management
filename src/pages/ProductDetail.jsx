import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/index.js'
import { Badge, Button, IconTile, SectionHeader, StatCard, Table } from '../components/ui/index.js'
import { branches } from '../data/mockData.js'
import { formatMedium, formatMoney, formatMoneyShort, formatNumber, formatTime } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { TONES } from '../lib/tones.js'
import { VAT_RATE, isLowAt, marginOf, minFor, movementsFor, productById, totalStock } from '../lib/stock.js'

/** Movement type → tone, so the ledger reads at a glance: in is green, out is red. */
const MOVE_TONE = {
  'Stock in': 'success',
  Transfer: 'brand',
  Sale: 'neutral',
  Damaged: 'danger',
  Return: 'success',
  'Count fix': 'warn',
}

/** Where each ledger row opens. Stock-ins and adjustments have no page of their own. */
function moveTarget(row) {
  if (row.kind === 'Sale') return `${ROUTES.sales}/${row.ref}`
  if (row.kind === 'Transfer') return `${ROUTES.transfers}/${row.ref}`
  if (row.kind === 'Stock in') return ROUTES.stockIn
  return ROUTES.adjustments
}

function MoveQty({ row }) {
  if (row.kind === 'Transfer') return <span className="font-semibold text-ink">→ {row.qty}</span>
  return (
    <span className={`font-semibold ${row.qty > 0 ? TONES.success.text : TONES.danger.text}`}>
      {row.qty > 0 ? `+${row.qty}` : `−${Math.abs(row.qty)}`}
    </span>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = productById(id)

  if (!product) return <Navigate to={ROUTES.products} replace />

  const total = totalStock(product)
  const margin = marginOf(product)

  return (
    <>
      <PageHeader
        back={ROUTES.products}
        title={product.name}
        subtitle={`${product.sku} · ${product.category} · sold per ${product.unit}`}
        action={
          <>
            <Button variant="outline" icon="edit" onClick={() => navigate(`${ROUTES.products}/${product.id}/edit`)}>
              Edit product
            </Button>
            <Button icon="truck" onClick={() => navigate(`${ROUTES.newTransfer}?product=${product.id}`)}>
              Send to shop
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total stock" icon="box" value={formatNumber(total)}>
            <p className="text-sm text-muted">across {branches.length} branches</p>
          </StatCard>
          <StatCard label="Sale price" icon="tag" value={formatMoney(product.price)}>
            <p className="text-sm text-muted">{formatMoney(product.price * (1 + VAT_RATE))} incl. VAT</p>
          </StatCard>
          <StatCard label="Cost & margin" icon="percent" value={formatMoney(product.cost)}>
            <p className="text-sm text-muted">
              {(margin * 100).toFixed(1)}% margin · {formatMoney(product.price - product.cost)} a unit
            </p>
          </StatCard>
          <StatCard label="Stock value" icon="chart" tone="brand" toned value={formatMoneyShort(total * product.cost)}>
            <p className="text-sm">at cost · {formatMoneyShort(total * product.price)} at sale price</p>
          </StatCard>
        </div>

        <section>
          <SectionHeader title="Stock in each branch" className="mb-3" />
          <Table
            rows={branches}
            onRowClick={(b) => navigate(b.type === 'shop' ? `${ROUTES.shops}/${b.id}` : ROUTES.stockIn)}
            columns={[
              {
                key: 'branch',
                label: 'Branch',
                render: (b) => (
                  <div className="flex items-center gap-3">
                    <IconTile name={b.type === 'warehouse' ? 'warehouse' : 'store'} tone={b.type === 'warehouse' ? 'brand' : 'neutral'} size="sm" />
                    <span className="font-semibold">{b.name}</span>
                  </div>
                ),
              },
              {
                key: 'onHand',
                label: 'On hand',
                align: 'right',
                render: (b) => (
                  <span className={`font-semibold ${isLowAt(product, b.id) ? TONES.danger.text : ''}`}>
                    {product.stock[b.id]}
                  </span>
                ),
              },
              { key: 'min', label: 'Minimum', align: 'right', render: (b) => <span className="text-muted">{minFor(product, b.id)}</span> },
              {
                key: 'status',
                label: 'Status',
                render: (b) =>
                  isLowAt(product, b.id) ? (
                    <Badge dot tone="danger" size="sm">
                      Low stock
                    </Badge>
                  ) : (
                    <Badge dot tone="success" size="sm">
                      In stock
                    </Badge>
                  ),
              },
              { key: 'value', label: 'Value at cost', align: 'right', render: (b) => formatMoney(product.stock[b.id] * product.cost) },
            ]}
          />
        </section>

        <section>
          <SectionHeader title="Stock movements" className="mb-3" />
          <Table
            rows={movementsFor(product.id)}
            rowKey={(row) => `${row.kind}-${row.ref}`}
            onRowClick={(row) => navigate(moveTarget(row))}
            columns={[
              {
                key: 'date',
                label: 'Date',
                render: (row) => (
                  <>
                    <span className="font-semibold">{formatMedium(row.at)}</span>
                    <span className="ml-2 text-muted">{formatTime(row.at)}</span>
                  </>
                ),
              },
              {
                key: 'kind',
                label: 'Type',
                render: (row) => (
                  <Badge dot tone={MOVE_TONE[row.kind]} size="sm">
                    {row.kind}
                  </Badge>
                ),
              },
              { key: 'ref', label: 'Reference', render: (row) => <span className="font-semibold">{row.ref}</span> },
              { key: 'where', label: 'Branch', render: (row) => <span className="text-muted">{row.where}</span> },
              { key: 'qty', label: 'Qty', align: 'right', render: (row) => <MoveQty row={row} /> },
              {
                key: 'detail',
                label: 'Detail',
                render: (row) => <span className="block max-w-56 truncate text-muted">{row.detail}</span>,
              },
            ]}
          />
        </section>
      </div>
    </>
  )
}
