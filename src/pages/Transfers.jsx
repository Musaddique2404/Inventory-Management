import { useNavigate } from 'react-router-dom'
import { PageHeader, ScreenPage } from '../components/layout/index.js'
import { Badge, Button, Table } from '../components/ui/index.js'
import { transfers } from '../data/mockData.js'
import { formatMedium, formatMoney, formatTime } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { STATUS_TONE } from '../lib/tones.js'
import { branchById, transferValue, units } from '../lib/stock.js'

export default function Transfers() {
  const navigate = useNavigate()

  return (
    <ScreenPage>
      <PageHeader
        title="Transfers"
        subtitle="What left the warehouse, and which shop it went to."
        action={
          <Button icon="plus" onClick={() => navigate(ROUTES.newTransfer)}>
            New transfer
          </Button>
        }
      />

      <Table
        fill
        rows={transfers}
        onRowClick={(t) => navigate(`${ROUTES.transfers}/${t.id}`)}
        columns={[
          { key: 'id', label: 'Transfer', render: (t) => <span className="font-semibold">{t.id}</span> },
          {
            key: 'date',
            label: 'Date',
            render: (t) => (
              <>
                {formatMedium(t.at)}
                <span className="ml-2 text-muted">{formatTime(t.at)}</span>
              </>
            ),
          },
          { key: 'shop', label: 'Shop', render: (t) => branchById(t.shopId).name },
          { key: 'items', label: 'Items', align: 'right', render: (t) => t.items.length },
          { key: 'units', label: 'Units', align: 'right', render: (t) => units(t.items) },
          { key: 'value', label: 'Value at cost', align: 'right', render: (t) => formatMoney(transferValue(t.items)) },
          {
            key: 'status',
            label: 'Status',
            render: (t) => (
              <Badge dot tone={STATUS_TONE[t.status]} size="sm">
                {t.status}
              </Badge>
            ),
          },
        ]}
      />
    </ScreenPage>
  )
}
