import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHeader, ScreenPage } from '../components/layout/index.js'
import { EmptyState, Select, StatCard, Table, Tabs } from '../components/ui/index.js'
import { PAYMENT_ICON, TODAY, sales, shops } from '../data/mockData.js'
import { formatMoney, formatMoneyShort, formatRelativeDay, formatTime, isSameDay } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { branchById, saleTotals, salesToday } from '../lib/stock.js'

const YESTERDAY = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 1)

export default function Sales() {
  const navigate = useNavigate()
  const [day, setDay] = useState('today')
  const [branchId, setBranchId] = useState('all')

  const today = salesToday.reduce(
    (sum, s) => {
      const t = saleTotals(s.items)
      return { total: sum.total + t.total, vat: sum.vat + t.vat }
    },
    { total: 0, vat: 0 },
  )

  const rows = sales.filter(
    (s) =>
      (branchId === 'all' || s.branchId === branchId) &&
      (day === 'all' || isSameDay(s.at, day === 'today' ? TODAY : YESTERDAY)),
  )

  return (
    <ScreenPage>
      <PageHeader title="Sales" subtitle="Every invoice from every shop." />

      <div className="mb-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales today" icon="trendUp" value={formatMoneyShort(today.total)}>
          <p className="text-sm text-muted">incl. VAT</p>
        </StatCard>
        <StatCard label="Invoices" icon="receipt" value={salesToday.length}>
          <p className="text-sm text-muted">across {shops.length} shops</p>
        </StatCard>
        <StatCard label="Average sale" icon="tag" value={formatMoney(today.total / (salesToday.length || 1))}>
          <p className="text-sm text-muted">per invoice</p>
        </StatCard>
        <StatCard label="VAT collected" icon="percent" value={formatMoney(today.vat)}>
          <p className="text-sm text-muted">15% output VAT</p>
        </StatCard>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs
          items={[
            { key: 'today', label: 'Today' },
            { key: 'yesterday', label: 'Yesterday' },
            { key: 'all', label: 'All' },
          ]}
          value={day}
          onChange={setDay}
        />
        <div className="w-full sm:w-56">
          <Select aria-label="Branch" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
            <option value="all">All shops</option>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon="receipt" title="No sales" description="Nothing matches this shop and day." />
      ) : (
        <Table
          fill
          rows={rows}
          onRowClick={(s) => navigate(`${ROUTES.sales}/${s.id}`)}
          columns={[
            { key: 'id', label: 'Invoice', render: (s) => <span className="font-semibold">{s.id}</span> },
            { key: 'branch', label: 'Branch', render: (s) => branchById(s.branchId).name },
            {
              key: 'customer',
              label: 'Customer',
              render: (s) => (
                <div>
                  <p>{s.customer.name}</p>
                  {s.customer.phone && <p className="text-xs text-muted">{s.customer.phone}</p>}
                </div>
              ),
            },
            {
              key: 'payment',
              label: 'Payment',
              render: (s) => (
                <span className="inline-flex items-center gap-2">
                  <Icon name={PAYMENT_ICON[s.payment]} className="size-4 text-muted" />
                  {s.payment}
                </span>
              ),
            },
            {
              key: 'time',
              label: 'Time',
              render: (s) => (
                <>
                  {formatRelativeDay(s.at, TODAY)}
                  <span className="ml-2 text-muted">{formatTime(s.at)}</span>
                </>
              ),
            },
            {
              key: 'total',
              label: 'Total',
              align: 'right',
              render: (s) => <span className="font-semibold">{formatMoney(saleTotals(s.items).total)}</span>,
            },
          ]}
        />
      )}
    </ScreenPage>
  )
}
