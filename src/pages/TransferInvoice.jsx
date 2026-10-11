import { Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/index.js'
import { DocActions, InvoiceSheet } from '../components/documents/index.js'
import { transfers } from '../data/mockData.js'
import { formatMedium, formatMoney, formatTime } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { branchById, productById, transferValue, units } from '../lib/stock.js'

export default function TransferInvoice() {
  const { id } = useParams()
  const transfer = transfers.find((t) => t.id === id)

  if (!transfer) return <Navigate to={ROUTES.transfers} replace />

  const main = branchById('main')
  const shop = branchById(transfer.shopId)

  return (
    <>
      <PageHeader
        back={ROUTES.transfers}
        title={`Transfer ${transfer.id}`}
        subtitle={`Main warehouse → ${shop.name}`}
        action={<DocActions title={`Transfer ${transfer.id}`} />}
      />

      <InvoiceSheet
        kind="Transfer note"
        number={transfer.id}
        status={transfer.status}
        meta={[
          { label: 'From', value: main.name, sub: main.address },
          { label: 'To', value: shop.name, sub: shop.address },
          { label: 'Date', value: formatMedium(transfer.at), sub: formatTime(transfer.at) },
          { label: 'Sent by', value: transfer.by, sub: 'Warehouse manager' },
        ]}
        items={transfer.items}
        columns={[
          { key: 'n', label: '#', render: (line) => <span className="text-muted">{transfer.items.indexOf(line) + 1}</span> },
          {
            key: 'product',
            label: 'Product',
            render: (line) => (
              <div>
                <p className="font-semibold">{productById(line.productId).name}</p>
                <p className="text-xs text-muted">{productById(line.productId).sku}</p>
              </div>
            ),
          },
          { key: 'qty', label: 'Qty', align: 'right', render: (line) => <span className="font-semibold">{line.qty}</span> },
          { key: 'cost', label: 'Unit cost', align: 'right', render: (line) => formatMoney(productById(line.productId).cost) },
          {
            key: 'value',
            label: 'Value',
            align: 'right',
            render: (line) => <span className="font-semibold">{formatMoney(line.qty * productById(line.productId).cost)}</span>,
          },
        ]}
        totals={[
          { label: 'Items', value: transfer.items.length },
          { label: 'Units', value: units(transfer.items) },
          { label: 'Value at cost', value: formatMoney(transferValue(transfer.items)), strong: true },
        ]}
        note={transfer.note}
      />
    </>
  )
}
