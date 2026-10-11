import { useState } from 'react'
import { PageHeader } from '../components/layout/index.js'
import {
  Badge,
  Button,
  Card,
  Field,
  QtyStepper,
  SectionHeader,
  Select,
  Table,
  Tabs,
  Textarea,
  cx,
} from '../components/ui/index.js'
import { useToast } from '../context/ToastContext.jsx'
import { ADJUSTMENT_TYPES, adjustments, branches, products } from '../data/mockData.js'
import { formatMedium, formatTime } from '../lib/format.js'
import { ADJUSTMENT_TONE, TONES } from '../lib/tones.js'
import { branchById, productById } from '../lib/stock.js'

/**
 * What the quantity means per type. Damage takes stock out, a return puts it
 * back, and a count fix *replaces* the figure with what was actually counted —
 * so the field label and the before → after maths change with the type.
 */
const TYPE_RULES = {
  Damaged: { label: 'Quantity damaged', after: (before, qty) => before - qty, reason: 'e.g. Bottles leaked in delivery' },
  Return: { label: 'Quantity returned', after: (before, qty) => before + qty, reason: 'e.g. Customer return, unopened' },
  'Count fix': { label: 'Counted on the shelf', after: (_, qty) => qty, reason: 'e.g. Monthly shelf count' },
}

export default function Adjustments() {
  const { toast } = useToast()
  const [type, setType] = useState('Damaged')
  const [branchId, setBranchId] = useState('olaya')
  const [productId, setProductId] = useState('p8')
  const [qty, setQty] = useState(1)
  const [reason, setReason] = useState('')

  const rule = TYPE_RULES[type]
  const product = productById(productId)
  const before = product.stock[branchId] ?? 0
  /* A switch of branch or product can leave a damage figure above what is
     now on hand; it is clamped here rather than chased with an effect. */
  const amount = type === 'Damaged' ? Math.min(qty, before) : qty
  const after = rule.after(before, amount)
  const change = after - before

  const changeType = (next) => {
    setType(next)
    setQty(next === 'Count fix' ? before : 1)
  }

  /* A count fix starts from what the system holds, so it re-reads that figure
     whenever the branch or product it describes changes. */
  const recount = (pid, bid) => type === 'Count fix' && setQty(productById(pid).stock[bid] ?? 0)
  const changeBranch = (id) => {
    setBranchId(id)
    recount(productId, id)
  }
  const changeProduct = (id) => {
    setProductId(id)
    recount(id, branchId)
  }

  const save = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      toast('Add a reason — it’s what an auditor reads.', 'danger')
      return
    }
    toast(`${type}: ${product.name} ${before} → ${after}. Sample only, nothing was saved.`, 'warn')
    setReason('')
  }

  return (
    <>
      <PageHeader
        title="Adjustments & returns"
        subtitle="Write off damage, take back returns and correct counts."
        action={null}
      />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeader title="New adjustment" className="mb-3" />
          <Card as="form" padding="lg" onSubmit={save}>
            <Tabs
              items={ADJUSTMENT_TYPES.map((t) => ({ key: t, label: t }))}
              value={type}
              onChange={changeType}
              className="mb-6"
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
              <Field label="Branch">
                {(props) => (
                  <Select {...props} value={branchId} onChange={(e) => changeBranch(e.target.value)}>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Product">
                {(props) => (
                  <Select {...props} value={productId} onChange={(e) => changeProduct(e.target.value)}>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {p.sku}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <div className="flex flex-col gap-1.5">
                <p className="text-[13px] font-semibold text-ink">{rule.label}</p>
                <QtyStepper
                  value={amount}
                  min={type === 'Count fix' ? 0 : 1}
                  max={type === 'Damaged' ? before : undefined}
                  onChange={setQty}
                  label={rule.label}
                  className="self-start"
                />
              </div>
            </div>

            {/* The effect, stated before it is saved: the one figure a wrong
                type or a slipped digit would get wrong. */}
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-tint-line bg-tint px-5 py-4">
              <div>
                <p className="eyebrow text-brand-800">Stock before</p>
                <p className="mt-1 text-[22px] leading-none font-bold text-ink">{before}</p>
              </div>
              <span aria-hidden="true" className="text-xl text-brand-600">
                →
              </span>
              <div>
                <p className="eyebrow text-brand-800">After</p>
                <p className="mt-1 text-[22px] leading-none font-bold text-ink">{after}</p>
              </div>
              <p
                className={cx(
                  'text-sm font-semibold sm:ml-auto',
                  change > 0 ? TONES.success.text : change < 0 ? TONES.danger.text : 'text-muted',
                )}
              >
                {change > 0 ? `+${change}` : change < 0 ? `−${Math.abs(change)}` : 'No change'} at {branchById(branchId).name}
              </p>
            </div>

            <Field label="Reason" required className="mt-5">
              {(props) => <Textarea {...props} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={rule.reason} />}
            </Field>

            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <Button type="submit" icon="check">
                Save adjustment
              </Button>
            </div>
          </Card>
        </section>

        <section>
          <SectionHeader title="Adjustment history" className="mb-3" />
          <Table
            rows={adjustments}
            columns={[
              { key: 'id', label: 'Reference', render: (a) => <span className="font-semibold">{a.id}</span> },
              {
                key: 'date',
                label: 'Date',
                render: (a) => (
                  <>
                    {formatMedium(a.at)}
                    <span className="ml-2 text-muted">{formatTime(a.at)}</span>
                  </>
                ),
              },
              {
                key: 'type',
                label: 'Type',
                render: (a) => (
                  <Badge dot tone={ADJUSTMENT_TONE[a.type]} size="sm">
                    {a.type}
                  </Badge>
                ),
              },
              { key: 'branch', label: 'Branch', render: (a) => branchById(a.branchId).name },
              { key: 'product', label: 'Product', render: (a) => productById(a.productId).name },
              {
                key: 'qty',
                label: 'Qty',
                align: 'right',
                render: (a) => (
                  <span className={cx('font-semibold', a.qty > 0 ? TONES.success.text : TONES.danger.text)}>
                    {a.qty > 0 ? `+${a.qty}` : `−${Math.abs(a.qty)}`}
                  </span>
                ),
              },
              {
                key: 'stock',
                label: 'Stock',
                align: 'right',
                render: (a) => (
                  <span className="text-muted">
                    {a.before} → {a.before + a.qty}
                  </span>
                ),
              },
              {
                key: 'reason',
                label: 'Reason',
                render: (a) => (
                  <div className="max-w-52">
                    <p className="truncate">{a.reason}</p>
                    <p className="truncate text-xs text-muted">by {a.by}</p>
                  </div>
                ),
              },
            ]}
          />
        </section>
      </div>
    </>
  )
}
