import { useNavigate } from 'react-router-dom'
import { PageHeader, ScreenPage } from '../components/layout/index.js'
import { Button, Table } from '../components/ui/index.js'
import { stockIns } from '../data/mockData.js'
import { formatMedium, formatMoney, formatNumber, formatTime } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { costTotal, units } from '../lib/stock.js'

export default function StockIn() {
  const navigate = useNavigate()

  return (
    <ScreenPage>
      <PageHeader
        title="Stock in"
        subtitle="Supplier deliveries, received into Main warehouse."
        action={
          <Button icon="plus" onClick={() => navigate(ROUTES.newStockIn)}>
            New stock in
          </Button>
        }
      />

      <Table
        fill
        rows={stockIns}
        columns={[
          { key: 'id', label: 'Reference', render: (d) => <span className="font-semibold">{d.id}</span> },
          {
            key: 'date',
            label: 'Date',
            render: (d) => (
              <>
                {formatMedium(d.at)}
                <span className="ml-2 text-muted">{formatTime(d.at)}</span>
              </>
            ),
          },
          { key: 'supplier', label: 'Supplier' },
          { key: 'supplierInvoice', label: 'Supplier invoice', render: (d) => <span className="text-muted">{d.supplierInvoice}</span> },
          { key: 'items', label: 'Items', align: 'right', render: (d) => d.items.length },
          { key: 'units', label: 'Units', align: 'right', render: (d) => formatNumber(units(d.items)) },
          {
            key: 'cost',
            label: 'Total cost',
            align: 'right',
            render: (d) => <span className="font-semibold">{formatMoney(costTotal(d.items))}</span>,
          },
        ]}
      />
    </ScreenPage>
  )
}
