import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHeader } from '../components/layout/index.js'
import { ProductPicker, SummaryCard } from '../components/documents/index.js'
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  QtyStepper,
  SectionHeader,
  Select,
  Table,
  cx,
} from '../components/ui/index.js'
import { useToast } from '../context/ToastContext.jsx'
import { PAYMENT_ICON, PAYMENT_METHODS, TODAY, shops } from '../data/mockData.js'
import { formatMoney, toInputDate } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { TONES } from '../lib/tones.js'
import { isLowAt, nextInvoiceNumber, productById, saleTotals } from '../lib/stock.js'

export default function NewSale() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [branchId, setBranchId] = useState(shops[0].id)
  const [date, setDate] = useState(toInputDate(TODAY))
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [payment, setPayment] = useState('Cash')
  /* Seeded with two lines so the form opens looking like a sale in progress. */
  const [lines, setLines] = useState(() => [
    { product: productById('p1'), qty: 2 },
    { product: productById('p5'), qty: 1 },
  ])

  const invoiceNo = nextInvoiceNumber(branchId)
  const stockOf = (product) => product.stock[branchId] ?? 0

  const add = (product) => {
    if (stockOf(product) < 1) {
      toast(`${product.name} is out of stock at this shop.`, 'danger')
      return
    }
    setLines((ls) => [...ls, { product, qty: 1 }])
  }
  const update = (id, qty) => setLines((ls) => ls.map((l) => (l.product.id === id ? { ...l, qty } : l)))
  const remove = (id) => setLines((ls) => ls.filter((l) => l.product.id !== id))

  /* Lines carry over to the new shop, clamped to what it holds — the stepper's
     max only bites on the next click, so a line could otherwise keep 5 where
     the new shop has 2. */
  const changeBranch = (id) => {
    setBranchId(id)
    setLines((ls) => ls.map((l) => ({ ...l, qty: Math.min(l.qty, Math.max(l.product.stock[id] ?? 0, 1)) })))
  }

  const { subtotal, vat, total } = saleTotals(lines.map((l) => ({ qty: l.qty, price: l.product.price })))
  const setField = (key) => (e) => setCustomer((c) => ({ ...c, [key]: e.target.value }))

  const save = () => {
    if (!lines.length) {
      toast('Add at least one item to the sale.', 'danger')
      return
    }
    const short = lines.find((l) => l.qty > stockOf(l.product))
    if (short) {
      toast(`${short.product.name}: only ${stockOf(short.product)} left at this shop.`, 'danger')
      return
    }
    toast(`${invoiceNo} saved — ${formatMoney(total)} by ${payment.toLowerCase()}. Sample only, nothing was saved.`, 'warn')
    navigate(ROUTES.sales)
  }

  return (
    <>
      <PageHeader back={ROUTES.sales} title="New sale" subtitle={`${invoiceNo} · VAT 15% added at checkout`} action={null} />

      <div className="grid gap-6 2xl:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card padding="lg">
            <p className="eyebrow mb-4 text-muted">Sale details</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Branch" required>
                {(props) => (
                  <Select {...props} value={branchId} onChange={(e) => changeBranch(e.target.value)}>
                    {shops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Invoice no." hint="Filled in automatically.">
                {(props) => <Input {...props} value={invoiceNo} readOnly className="font-semibold" />}
              </Field>
              <Field label="Date">
                {(props) => <Input {...props} type="date" value={date} onChange={(e) => setDate(e.target.value)} />}
              </Field>
              <Field label="Customer name" hint="Leave blank for a walk-in customer." className="lg:col-span-2">
                {(props) => <Input {...props} icon="user" value={customer.name} onChange={setField('name')} placeholder="Walk-in customer" />}
              </Field>
              <Field label="Phone">
                {(props) => <Input {...props} icon="phone" type="tel" value={customer.phone} onChange={setField('phone')} placeholder="+966 5x xxx xxxx" />}
              </Field>
            </div>
          </Card>

          <section>
            <SectionHeader title="Items" count={lines.length} className="mb-3" />
            <div className="mb-3">
              <ProductPicker
                onPick={add}
                branchId={branchId}
                exclude={lines.map((l) => l.product.id)}
                icon="scan"
                placeholder="Scan a barcode or search products"
              />
            </div>

            {lines.length === 0 ? (
              <EmptyState icon="scan" title="No items yet" description="Scan a barcode or search above to start the sale." />
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
                        <p className="font-semibold">{l.product.name}</p>
                        <p className="text-xs text-muted">{l.product.sku}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'stock',
                    label: 'In stock',
                    align: 'right',
                    render: (l) => (
                      <span className={cx(isLowAt(l.product, branchId) && cx('font-semibold', TONES.danger.text))}>
                        {stockOf(l.product)}
                      </span>
                    ),
                  },
                  { key: 'price', label: 'Price', align: 'right', render: (l) => formatMoney(l.product.price) },
                  {
                    key: 'qty',
                    label: 'Qty',
                    align: 'center',
                    render: (l) => (
                      <QtyStepper value={l.qty} min={1} max={Math.max(stockOf(l.product), 1)} onChange={(qty) => update(l.product.id, qty)} />
                    ),
                  },
                  {
                    key: 'amount',
                    label: 'Amount',
                    align: 'right',
                    render: (l) => <span className="font-semibold">{formatMoney(l.qty * l.product.price)}</span>,
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

        <SummaryCard
          eyebrow="Payment"
          rows={[
            { label: 'Items', value: lines.length },
            { label: 'Subtotal', value: formatMoney(subtotal) },
            { label: 'VAT 15%', value: formatMoney(vat) },
          ]}
          total={{ label: 'Total', value: formatMoney(total) }}
          action={
            <>
              <Button fullWidth size="lg" icon="check" onClick={save}>
                Save sale
              </Button>
              <Button fullWidth variant="outline" onClick={() => navigate(ROUTES.sales)}>
                Cancel
              </Button>
            </>
          }
        >
          {/* Three fixed choices, so tiles rather than a select — one tap at
              a till, and the chosen method is visible at a glance. */}
          <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment method">
            {PAYMENT_METHODS.map((method) => {
              const on = method === payment
              return (
                <Button
                  key={method}
                  variant="bare"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPayment(method)}
                  className={cx(
                    'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[12px] font-semibold transition',
                    on ? 'border-brand-700 bg-tint text-brand-900' : 'border-line text-muted hover:bg-surface hover:text-ink',
                  )}
                >
                  <Icon name={PAYMENT_ICON[method]} className="size-5" strokeWidth={1.8} />
                  {method}
                </Button>
              )
            })}
          </div>
        </SummaryCard>
      </div>
    </>
  )
}
