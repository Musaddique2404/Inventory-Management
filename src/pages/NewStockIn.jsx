import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/layout/index.js'
import { ProductPicker } from '../components/documents/index.js'
import { NewProductModal } from '../components/products/index.js'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  QtyStepper,
  SectionHeader,
  Select,
  Table,
} from '../components/ui/index.js'
import { useToast } from '../context/ToastContext.jsx'
import { TODAY, invoicePrefixes, suppliers } from '../data/mockData.js'
import { formatMoney, formatNumber, toInputDate } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { productById } from '../lib/stock.js'

const NEXT_REF = `SI-${invoicePrefixes.find((p) => p.id === 'stock-in').next}`

export default function NewStockIn() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [supplier, setSupplier] = useState(suppliers[0])
  const [invoiceNo, setInvoiceNo] = useState('')
  const [date, setDate] = useState(toInputDate(TODAY))
  const [touched, setTouched] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  /* Seeded with the two products the warehouse is short of, so the form opens
     looking like a real delivery rather than an empty grid. */
  const [lines, setLines] = useState(() => [
    { product: productById('p6'), qty: 120, cost: 3.9 },
    { product: productById('p10'), qty: 48, cost: 7.3 },
  ])

  const add = (product) => setLines((ls) => [...ls, { product, qty: 1, cost: product.cost }])
  const update = (id, patch) => setLines((ls) => ls.map((l) => (l.product.id === id ? { ...l, ...patch } : l)))
  const remove = (id) => setLines((ls) => ls.filter((l) => l.product.id !== id))

  const totalUnits = lines.reduce((sum, l) => sum + l.qty, 0)
  const totalCost = lines.reduce((sum, l) => sum + l.qty * l.cost, 0)
  const invoiceError = touched && !invoiceNo.trim() ? 'Enter the number on the supplier’s invoice.' : null

  const receive = () => {
    setTouched(true)
    if (!invoiceNo.trim()) return
    if (!lines.length) {
      toast('Add at least one item to receive.', 'danger')
      return
    }
    toast(`${NEXT_REF} — ${formatNumber(totalUnits)} units into Main. Sample only, nothing was saved.`, 'warn')
    navigate(ROUTES.stockIn)
  }

  return (
    <>
      <PageHeader
        back={ROUTES.stockIn}
        title="New stock in"
        subtitle={`${NEXT_REF} · a supplier delivery into Main warehouse`}
        action={null}
      />

      <div className="flex flex-col gap-6">
        <Card padding="lg">
          <p className="eyebrow mb-4 text-muted">Supplier</p>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Supplier" required>
              {(props) => (
                <Select {...props} value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                  {suppliers.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Supplier invoice no." required error={invoiceError}>
              {(props) => (
                <Input
                  {...props}
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  error={invoiceError}
                  placeholder="e.g. GFD-77215"
                />
              )}
            </Field>
            <Field label="Invoice date">
              {(props) => <Input {...props} type="date" value={date} onChange={(e) => setDate(e.target.value)} />}
            </Field>
          </div>
        </Card>

        <section>
          <SectionHeader
            title="Items"
            count={lines.length}
            className="mb-3"
            action={
              <Button variant="outline" size="sm" icon="plus" onClick={() => setNewOpen(true)}>
                New product
              </Button>
            }
          />
          <div className="mb-3">
            <ProductPicker onPick={add} exclude={lines.map((l) => l.product.id)} icon="scan" placeholder="Scan a barcode or search products" />
          </div>

          {lines.length === 0 ? (
            <EmptyState
              icon="inbox"
              title="No items yet"
              description="Search or scan above to add what arrived. Something new? Use New product."
            />
          ) : (
            <Table
              rows={lines}
              rowKey={(l) => l.product.id}
              columns={[
                {
                  key: 'product',
                  label: 'Product',
                  render: (l) => (
                    <div>
                      <p className="flex items-center gap-2 font-semibold">
                        {l.product.name}
                        {l.product.isNew && (
                          <Badge tone="brand" size="sm">
                            New
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted">{l.product.sku}</p>
                    </div>
                  ),
                },
                { key: 'main', label: 'In Main', align: 'right', render: (l) => <span className="text-muted">{l.product.stock.main}</span> },
                {
                  key: 'qty',
                  label: 'Quantity',
                  align: 'center',
                  render: (l) => <QtyStepper value={l.qty} min={1} onChange={(qty) => update(l.product.id, { qty })} />,
                },
                {
                  key: 'cost',
                  label: 'Unit cost (SAR)',
                  align: 'right',
                  render: (l) => (
                    <div className="ml-auto w-28">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        aria-label={`Unit cost for ${l.product.name}`}
                        value={l.cost}
                        onChange={(e) => update(l.product.id, { cost: Number(e.target.value) || 0 })}
                        className="no-spin px-3! py-1.5! text-right"
                      />
                    </div>
                  ),
                },
                {
                  key: 'total',
                  label: 'Line total',
                  align: 'right',
                  render: (l) => <span className="font-semibold">{formatMoney(l.qty * l.cost)}</span>,
                },
                {
                  key: 'remove',
                  label: '',
                  render: (l) => (
                    <Button variant="ghost" size="sm" icon="trash" aria-label={`Remove ${l.product.name}`} onClick={() => remove(l.product.id)} />
                  ),
                },
              ]}
            />
          )}
        </section>
      </div>

      {/* The running totals ride along the bottom of the viewport, so the
          receive button is never a scroll away on a long delivery. */}
      <div className="sticky bottom-3 z-20 mt-6">
        <Card padding="none" className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 shadow-xl shadow-black/5">
          <dl className="flex gap-8">
            {[
              ['Items', lines.length],
              ['Units', formatNumber(totalUnits)],
              ['Total cost', formatMoney(totalCost)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="eyebrow text-muted">{label}</dt>
                <dd className="mt-1 text-lg leading-none font-bold text-ink tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(ROUTES.stockIn)}>
              Cancel
            </Button>
            <Button icon="inbox" onClick={receive}>
              Receive into Main
            </Button>
          </div>
        </Card>
      </div>

      <NewProductModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onAdd={(product) => {
          add(product)
          toast(`${product.name} added to this delivery.`)
        }}
      />
    </>
  )
}
