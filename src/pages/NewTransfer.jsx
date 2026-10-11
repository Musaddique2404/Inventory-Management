import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHeader } from '../components/layout/index.js'
import { ProductPicker, SummaryCard } from '../components/documents/index.js'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  IconTile,
  QtyStepper,
  SectionHeader,
  Table,
  Textarea,
  cx,
} from '../components/ui/index.js'
import { useToast } from '../context/ToastContext.jsx'
import { invoicePrefixes, shops } from '../data/mockData.js'
import { formatMoney } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { TONES } from '../lib/tones.js'
import { branchById, isLowAt, lowStockAt, minFor, productById } from '../lib/stock.js'

const NEXT_REF = `TR-${invoicePrefixes.find((p) => p.id === 'transfer').next}`

/** Enough to take the shop back to double its reorder level, never more than Main holds. */
function topUp(product, shopId) {
  const want = Math.max(minFor(product, shopId) * 2 - (product.stock[shopId] ?? 0), 1)
  return Math.min(want, product.stock.main)
}

export default function NewTransfer() {
  const navigate = useNavigate()
  const { toast } = useToast()
  /* ?shop= and ?product= arrive from "Send to shop", "Add stock to this shop"
     and the dashboard's alerts, so the form opens already pointed at the job. */
  const [params] = useSearchParams()

  const startShop = shops.some((s) => s.id === params.get('shop')) ? params.get('shop') : shops[0].id

  const [shopId, setShopId] = useState(startShop)
  const [lines, setLines] = useState(() => {
    const product = productById(params.get('product'))
    return product ? [{ product, qty: topUp(product, startShop) }] : []
  })
  const [note, setNote] = useState('')

  const shop = branchById(shopId)
  const onList = lines.map((l) => l.product.id)
  const suggestions = lowStockAt(shopId).filter((p) => !onList.includes(p.id) && p.stock.main > 0)

  const add = (product) => setLines((ls) => [...ls, { product, qty: topUp(product, shopId) }])
  const update = (id, qty) => setLines((ls) => ls.map((l) => (l.product.id === id ? { ...l, qty } : l)))
  const remove = (id) => setLines((ls) => ls.filter((l) => l.product.id !== id))

  const totalUnits = lines.reduce((sum, l) => sum + l.qty, 0)
  const value = lines.reduce((sum, l) => sum + l.qty * l.product.cost, 0)

  const send = () => {
    if (!lines.length) {
      toast('Add at least one item to send.', 'danger')
      return
    }
    toast(`${NEXT_REF} — ${totalUnits} units on their way to ${shop.name}. Sample only, nothing was saved.`, 'warn')
    navigate(ROUTES.transfers)
  }

  return (
    <>
      <PageHeader
        back={ROUTES.transfers}
        title="New transfer"
        subtitle={`${NEXT_REF} · from Main warehouse to a shop`}
        action={null}
      />

      <div className="grid gap-6 2xl:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <section>
            <SectionHeader title="Send to" className="mb-3" />
            <div className="grid gap-3 sm:grid-cols-3">
              {shops.map((s) => {
                const selected = s.id === shopId
                const low = lowStockAt(s.id).length
                return (
                  <Card
                    key={s.id}
                    as="button"
                    type="button"
                    padding="sm"
                    aria-pressed={selected}
                    onClick={() => setShopId(s.id)}
                    surface={selected ? 'border-brand-700 bg-tint' : 'border-line bg-panel hover:border-brand-300 hover:bg-surface'}
                    className="flex flex-col gap-3 text-left transition"
                  >
                    <span className="flex w-full items-center justify-between gap-2">
                      <IconTile name="store" tone={selected ? 'brand' : 'neutral'} size="sm" />
                      {low > 0 && (
                        <Badge tone="danger" size="sm">
                          {low} low
                        </Badge>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-bold text-ink">{s.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{s.manager}</span>
                    </span>
                  </Card>
                )
              })}
            </div>
          </section>

          <section>
            <SectionHeader title="Items" count={lines.length} className="mb-3" />
            <div className="mb-3">
              <ProductPicker onPick={add} exclude={onList} />
            </div>

            {suggestions.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-tint-line bg-tint px-5 py-3.5">
                <p className="flex items-center gap-2.5 text-sm text-brand-900">
                  <Icon name="info" className="size-4 shrink-0" />
                  {suggestions.length} product{suggestions.length === 1 ? ' is' : 's are'} below minimum at {shop.name}.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  icon="plus"
                  onClick={() => setLines((ls) => [...ls, ...suggestions.map((p) => ({ product: p, qty: topUp(p, shopId) }))])}
                >
                  Add {suggestions.length === 1 ? 'it' : 'them'}
                </Button>
              </div>
            )}

            {lines.length === 0 ? (
              <EmptyState
                icon="truck"
                title="Nothing to send yet"
                description="Search for a product above, or add the shop’s low-stock items in one go."
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
                        <p className="font-semibold">{l.product.name}</p>
                        <p className="text-xs text-muted">{l.product.sku}</p>
                      </div>
                    ),
                  },
                  { key: 'main', label: 'In Main', align: 'right', render: (l) => l.product.stock.main },
                  {
                    key: 'shop',
                    label: 'In shop',
                    align: 'right',
                    render: (l) => (
                      <span className={cx('font-semibold', isLowAt(l.product, shopId) && TONES.danger.text)}>
                        {l.product.stock[shopId]}
                      </span>
                    ),
                  },
                  {
                    key: 'qty',
                    label: 'Send',
                    align: 'center',
                    render: (l) => (
                      <QtyStepper value={l.qty} min={1} max={l.product.stock.main} onChange={(qty) => update(l.product.id, qty)} />
                    ),
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

          <Field label="Note" hint="Shown on the transfer note the shop receives.">
            {(props) => (
              <Textarea {...props} rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Weekend restock" />
            )}
          </Field>
        </div>

        <SummaryCard
          eyebrow="Transfer summary"
          rows={[
            { label: 'From', value: 'Main warehouse' },
            { label: 'To', value: shop.name },
            { label: 'Items', value: lines.length },
            { label: 'Units', value: totalUnits },
          ]}
          total={{ label: 'Value at cost', value: formatMoney(value) }}
          action={
            <Button fullWidth size="lg" icon="truck" onClick={send}>
              Send transfer
            </Button>
          }
          caption={`Leaves Main now and shows at ${shop.name} once received.`}
        />
      </div>
    </>
  )
}
