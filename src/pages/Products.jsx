import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHeader, ScreenPage } from '../components/layout/index.js'
import { Button, EmptyState, IconTile, Input, Select, Table, Tabs } from '../components/ui/index.js'
import { CATEGORIES, products } from '../data/mockData.js'
import { formatMoney, formatNumber } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { TONES } from '../lib/tones.js'
import { isLow, lowStockProducts, totalStock } from '../lib/stock.js'

export default function Products() {
  const navigate = useNavigate()
  /* The Low stock tab lives in the URL, so the dashboard's "Review products"
     link and a shared link land on the same filtered view. */
  const [params, setParams] = useSearchParams()
  const filter = params.get('filter') === 'low' ? 'low' : 'all'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const q = query.trim().toLowerCase()
  const rows = products.filter(
    (p) =>
      (filter === 'all' || isLow(p)) &&
      (category === 'all' || p.category === category) &&
      `${p.name} ${p.sku}`.toLowerCase().includes(q),
  )

  const clear = () => {
    setQuery('')
    setCategory('all')
    setParams({}, { replace: true })
  }

  return (
    <ScreenPage>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products · ${lowStockProducts.length} low on stock`}
        action={
          <Button icon="plus" onClick={() => navigate(ROUTES.newProduct)}>
            Add product
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs
          items={[
            { key: 'all', label: 'All', count: products.length },
            { key: 'low', label: 'Low stock', count: lowStockProducts.length },
          ]}
          value={filter}
          onChange={(key) => setParams(key === 'low' ? { filter: 'low' } : {}, { replace: true })}
        />
        <div className="w-full sm:w-56">
          <Select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div className="w-full sm:ml-auto sm:w-72">
          <Input
            icon="search"
            aria-label="Search products"
            placeholder="Search name or SKU"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon="box"
          title="No products match"
          description="Try another name, SKU or category."
          action={
            <Button variant="outline" onClick={clear}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <Table
          fill
          rows={rows}
          onRowClick={(p) => navigate(`${ROUTES.products}/${p.id}`)}
          columns={[
            {
              key: 'product',
              label: 'Product',
              render: (p) => (
                <div className="flex items-center gap-3">
                  <IconTile name="box" tone={isLow(p) ? 'danger' : 'neutral'} size="sm" />
                  <div>
                    <p className="font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.category} · per {p.unit}
                    </p>
                  </div>
                </div>
              ),
            },
            { key: 'sku', label: 'SKU', render: (p) => <span className="text-muted">{p.sku}</span> },
            { key: 'price', label: 'Sale price', align: 'right', render: (p) => formatMoney(p.price) },
            {
              key: 'stock',
              label: 'Stock',
              align: 'right',
              render: (p) =>
                isLow(p) ? (
                  <span className={`inline-flex items-center gap-1.5 font-semibold ${TONES.danger.text}`}>
                    <Icon name="alert" className="size-3.5" strokeWidth={2} />
                    {formatNumber(totalStock(p))}
                  </span>
                ) : (
                  <span className="font-semibold">{formatNumber(totalStock(p))}</span>
                ),
            },
          ]}
        />
      )}
    </ScreenPage>
  )
}
