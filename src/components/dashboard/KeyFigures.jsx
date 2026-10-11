import { useNavigate } from 'react-router-dom'
import { Button, StatCard } from '../ui/index.js'
import { branches, products, transfers } from '../../data/mockData.js'
import { formatMoneyShort, formatNumber } from '../../lib/format.js'
import { ROUTES } from '../../lib/nav.js'
import { branchById, lowStockProducts, stockValueAt, unitsAt } from '../../lib/stock.js'

/** The four figures an owner checks first: what the stock is worth, how much
    there is, what is running out, and what is on the road. */
export function KeyFigures() {
  const navigate = useNavigate()
  const value = branches.reduce((sum, b) => sum + stockValueAt(b.id), 0)
  const units = branches.reduce((sum, b) => sum + unitsAt(b.id), 0)
  const inTransit = transfers.filter((t) => t.status === 'In transit')

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Stock value" icon="tag" value={formatMoneyShort(value)}>
        <p className="text-sm text-muted">at cost, {branches.length} branches</p>
      </StatCard>

      <StatCard label="Units in stock" icon="box" value={formatNumber(units)}>
        <p className="text-sm text-muted">{products.length} products</p>
      </StatCard>

      <StatCard label="Low stock" icon="alert" tone="danger" toned value={lowStockProducts.length}>
        <Button
          variant="bare"
          onClick={() => navigate(`${ROUTES.products}?filter=low`)}
          className="inline-flex items-center gap-1 text-sm font-semibold transition hover:opacity-70"
        >
          Review products <span aria-hidden="true">→</span>
        </Button>
      </StatCard>

      <StatCard label="In transit" icon="truck" tone="warn" toned value={inTransit.length}>
        <p className="truncate text-sm">
          {inTransit[0] ? `${inTransit[0].id} to ${branchById(inTransit[0].shopId).name}` : 'nothing on the road'}
        </p>
      </StatCard>
    </div>
  )
}
