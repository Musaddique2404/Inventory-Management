import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/index.js'
import { Badge, Button, List, ListRow, SectionHeader, StatCard, Table } from '../components/ui/index.js'
import { products, transfers } from '../data/mockData.js'
import { formatMedium, formatMoney, formatMoneyShort, formatNumber } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { STATUS_TONE, TONES } from '../lib/tones.js'
import { branchById, isLowAt, minFor, salesTodayAt, units, unitsAt, unitsSentThisWeek } from '../lib/stock.js'

export default function ShopDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const shop = branchById(id)

  if (!shop || shop.type !== 'shop') return <Navigate to={ROUTES.shops} replace />

  const held = products.filter((p) => (p.stock[shop.id] ?? 0) > 0)
  const lastTransfer = transfers.find((t) => t.shopId === shop.id)
  const totalValue = held.reduce((sum, p) => sum + p.stock[shop.id] * p.price, 0)

  return (
    <>
      <PageHeader
        back={ROUTES.shops}
        title={shop.name}
        subtitle={`${shop.address} · Manager ${shop.manager}`}
        action={
          <Button icon="plus" onClick={() => navigate(`${ROUTES.newTransfer}?shop=${shop.id}`)}>
            Add stock to this shop
          </Button>
        }
      />

      <div className="flex flex-col gap-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Units" icon="box" value={formatNumber(unitsAt(shop.id))}>
            <p className="text-sm text-muted">{held.length} products on the shelf</p>
          </StatCard>
          <StatCard label="Sales today" icon="trendUp" value={formatMoneyShort(salesTodayAt(shop.id))}>
            <p className="text-sm text-muted">incl. VAT</p>
          </StatCard>
          <StatCard label="Sent this week" icon="truck" tone="brand" toned value={formatNumber(unitsSentThisWeek(shop.id))}>
            <p className="text-sm">units from Main</p>
          </StatCard>
        </div>

        {lastTransfer && (
          <section>
            <SectionHeader title="Last transfer" className="mb-3" />
            <List>
              <ListRow
                icon="truck"
                tone="brand"
                title={lastTransfer.id}
                subtitle={`${formatMedium(lastTransfer.at)} · ${units(lastTransfer.items)} units from Main warehouse`}
                trailing={
                  <Badge dot tone={STATUS_TONE[lastTransfer.status]} size="sm">
                    {lastTransfer.status}
                  </Badge>
                }
                onClick={() => navigate(`${ROUTES.transfers}/${lastTransfer.id}`)}
              />
            </List>
          </section>
        )}

        <section>
          <SectionHeader title="Products in this shop" count={held.length} className="mb-3" />
          <Table
            rows={held}
            onRowClick={(p) => navigate(`${ROUTES.products}/${p.id}`)}
            columns={[
              {
                key: 'product',
                label: 'Product',
                render: (p) => (
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted">{p.sku}</p>
                  </div>
                ),
              },
              { key: 'price', label: 'Price', align: 'right', render: (p) => formatMoney(p.price) },
              {
                key: 'qty',
                label: 'Quantity',
                align: 'right',
                render: (p) =>
                  isLowAt(p, shop.id) ? (
                    <span className={`font-semibold ${TONES.danger.text}`}>
                      {p.stock[shop.id]}
                      <span className="block text-xs font-normal">min {minFor(p, shop.id)}</span>
                    </span>
                  ) : (
                    <span className="font-semibold">{p.stock[shop.id]}</span>
                  ),
              },
              {
                key: 'value',
                label: 'Value',
                align: 'right',
                render: (p) => <span className="font-semibold">{formatMoney(p.stock[shop.id] * p.price)}</span>,
              },
            ]}
            footer={
              <tr>
                <td colSpan={2} className="px-5 py-3.5 text-sm font-semibold text-ink">
                  Total
                </td>
                <td className="px-5 py-3.5 text-right text-sm font-semibold text-ink tabular-nums">
                  {formatNumber(unitsAt(shop.id))}
                </td>
                <td className="px-5 py-3.5 text-right text-sm font-bold text-ink tabular-nums">{formatMoney(totalValue)}</td>
              </tr>
            }
          />
        </section>
      </div>
    </>
  )
}
