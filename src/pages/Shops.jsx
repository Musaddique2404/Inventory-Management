import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHeader } from '../components/layout/index.js'
import { Badge, Button, Card, Field, IconTile, Input, Modal } from '../components/ui/index.js'
import { useToast } from '../context/ToastContext.jsx'
import { shops } from '../data/mockData.js'
import { formatMoneyShort, formatNumber } from '../lib/format.js'
import { ROUTES } from '../lib/nav.js'
import { lowStockAt, salesTodayAt, stockValueAt, unitsAt } from '../lib/stock.js'

const EMPTY_SHOP = { name: '', address: '', manager: '', phone: '' }

function AddShopModal({ open, onClose }) {
  const { toast } = useToast()
  const [form, setForm] = useState(EMPTY_SHOP)
  const [touched, setTouched] = useState(false)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const nameError = touched && !form.name.trim() ? 'Give the shop a name.' : null

  const close = () => {
    setForm(EMPTY_SHOP)
    setTouched(false)
    onClose()
  }

  const save = () => {
    setTouched(true)
    if (!form.name.trim()) return
    toast(`${form.name} — sample only, the shop wasn’t added.`, 'warn')
    close()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add shop"
      description="A new branch that sells. It starts empty — send it stock with a transfer."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button icon="plus" onClick={save}>
            Add shop
          </Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Shop name" required error={nameError} className="sm:col-span-2">
          {(props) => <Input {...props} value={form.name} onChange={set('name')} error={nameError} placeholder="e.g. Qatif shop" />}
        </Field>
        <Field label="Address" className="sm:col-span-2">
          {(props) => <Input {...props} icon="mapPin" value={form.address} onChange={set('address')} placeholder="Street, district, city" />}
        </Field>
        <Field label="Manager">
          {(props) => <Input {...props} icon="user" value={form.manager} onChange={set('manager')} />}
        </Field>
        <Field label="Phone">
          {(props) => <Input {...props} icon="phone" type="tel" value={form.phone} onChange={set('phone')} />}
        </Field>
      </div>
    </Modal>
  )
}

export default function Shops() {
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)

  return (
    <>
      <PageHeader
        title="Shops"
        subtitle={`${shops.length} shops, stocked from Main warehouse.`}
        action={
          <Button icon="plus" onClick={() => setAdding(true)}>
            Add shop
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {shops.map((shop) => {
          const low = lowStockAt(shop.id).length
          return (
            <Card
              key={shop.id}
              as="button"
              type="button"
              padding="none"
              onClick={() => navigate(`${ROUTES.shops}/${shop.id}`)}
              surface="border-line bg-panel hover:border-brand-300"
              className="group flex flex-col text-left transition"
            >
              <div className="flex w-full items-start gap-3.5 px-6 pt-6">
                <IconTile name="store" tone="brand" size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] font-bold text-ink transition group-hover:text-brand-700">{shop.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
                    <Icon name="mapPin" className="size-3.5 shrink-0" />
                    <span className="truncate">{shop.address}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted">
                    <Icon name="user" className="size-3.5 shrink-0" />
                    <span className="truncate">{shop.manager}</span>
                  </p>
                </div>
                {low > 0 ? (
                  <Badge tone="danger" size="sm">
                    {low} low
                  </Badge>
                ) : (
                  <Badge tone="success" size="sm">
                    Stocked
                  </Badge>
                )}
              </div>

              <dl className="mt-5 grid w-full grid-cols-3 divide-x divide-line-soft border-t border-line-soft">
                {[
                  ['Units', formatNumber(unitsAt(shop.id))],
                  ['Stock value', formatMoneyShort(stockValueAt(shop.id))],
                  ['Sales today', formatMoneyShort(salesTodayAt(shop.id))],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 px-4 py-4 first:pl-6">
                    <dt className="eyebrow truncate text-muted">{label}</dt>
                    <dd className="mt-1 truncate text-[17px] font-bold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )
        })}
      </div>

      <AddShopModal open={adding} onClose={() => setAdding(false)} />
    </>
  )
}
