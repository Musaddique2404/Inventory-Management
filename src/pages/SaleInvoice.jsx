import { Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/index.js'
import { DocActions, InvoiceSheet } from '../components/documents/index.js'
import { TODAY, sales } from '../data/mockData.js'
import { formatMedium, formatMoney, formatRelativeDay, formatTime } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { VAT_RATE, branchById, productById, saleTotals } from '../lib/stock.js'

export default function SaleInvoice() {
  const { id } = useParams()
  const sale = sales.find((s) => s.id === id)

  if (!sale) return <Navigate to={ROUTES.sales} replace />

  const branch = branchById(sale.branchId)
  const { subtotal, vat, total } = saleTotals(sale.items)

  return (
    <>
      <PageHeader
        back={ROUTES.sales}
        title={`Invoice ${sale.id}`}
        subtitle={`${branch.name} · ${formatRelativeDay(sale.at, TODAY)}, ${formatTime(sale.at)}`}
        action={<DocActions title={`Invoice ${sale.id}`} />}
      />

      <InvoiceSheet
        kind="Tax invoice"
        number={sale.id}
        status="Paid"
        meta={[
          { label: 'Branch', value: branch.name, sub: branch.address },
          { label: 'Customer', value: sale.customer.name, sub: sale.customer.phone || 'No phone given' },
          { label: 'Date', value: formatMedium(sale.at), sub: formatTime(sale.at) },
          { label: 'Payment', value: sale.payment, sub: 'Paid in full' },
        ]}
        items={sale.items}
        columns={[
          { key: 'n', label: '#', render: (line) => <span className="text-muted">{sale.items.indexOf(line) + 1}</span> },
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
          { key: 'qty', label: 'Qty', align: 'right', render: (line) => line.qty },
          { key: 'price', label: 'Unit price', align: 'right', render: (line) => formatMoney(line.price) },
          { key: 'net', label: 'Net', align: 'right', render: (line) => formatMoney(line.qty * line.price) },
          { key: 'vat', label: 'VAT 15%', align: 'right', render: (line) => formatMoney(line.qty * line.price * VAT_RATE) },
          {
            key: 'total',
            label: 'Total',
            align: 'right',
            render: (line) => <span className="font-semibold">{formatMoney(line.qty * line.price * (1 + VAT_RATE))}</span>,
          },
        ]}
        totals={[
          { label: 'Subtotal', value: formatMoney(subtotal) },
          { label: 'VAT 15%', value: formatMoney(vat) },
          { label: 'Total', value: formatMoney(total), strong: true },
        ]}
      />
    </>
  )
}
