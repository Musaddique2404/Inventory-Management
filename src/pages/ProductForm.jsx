import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader, ScreenPage } from '../components/layout/index.js'
import { Button, Card } from '../components/ui/index.js'
import { EMPTY_PRODUCT, ProductFields, productErrors } from '../components/products/index.js'
import { useToast } from '../context/ToastContext.jsx'
import { ROUTES } from '../lib/nav.js'
import { productById, totalStock } from '../lib/stock.js'

/** Add product (/products/new) and Edit product (/products/:id/edit) — one form. */
export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const existing = id ? productById(id) : null

  const [form, setForm] = useState(() =>
    existing
      ? {
          name: existing.name,
          sku: existing.sku,
          category: existing.category,
          unit: existing.unit,
          min: String(existing.min.shop),
          price: String(existing.price),
          cost: String(existing.cost),
          opening: String(totalStock(existing)),
        }
      : EMPTY_PRODUCT,
  )
  const [touched, setTouched] = useState(false)

  if (id && !existing) return <Navigate to={ROUTES.products} replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const errors = touched ? productErrors(form) : {}
  const back = existing ? `${ROUTES.products}/${existing.id}` : ROUTES.products

  const save = (e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(productErrors(form)).length) return
    toast('This is a prototype — the product wasn’t saved.', 'warn')
    navigate(back)
  }

  return (
    <ScreenPage>
      <PageHeader
        back={back}
        title={existing ? 'Edit product' : 'Add product'}
        subtitle={existing ? `${existing.name} · ${existing.sku}` : 'New products start in Main warehouse.'}
        action={null}
      />

      {/* Full width, and down to the bottom of the screen from lg up with the
          buttons on the card's bottom edge. */}
      <Card as="form" padding="lg" className="flex flex-col lg:flex-1" onSubmit={save}>
        <div className="lg:flex-1">
          <ProductFields form={form} set={set} errors={errors} editing={Boolean(existing)} />
        </div>

        <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
          <Button type="submit" icon="check">
            {existing ? 'Save changes' : 'Add product'}
          </Button>
          <Button variant="ghost" onClick={() => navigate(back)}>
            Cancel
          </Button>
        </div>
      </Card>
    </ScreenPage>
  )
}
