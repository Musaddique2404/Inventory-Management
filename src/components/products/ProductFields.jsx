import { Field, Input, Select } from '../ui/index.js'
import { CATEGORIES, UNITS } from '../../data/mockData.js'

/**
 * The product fields, shared by the Add / Edit product page and the "New
 * product" pop-up on Stock in — one form, so a product made in either place
 * carries the same data.
 *
 * Controlled: the caller owns `form` and passes `set(key)` → change handler.
 * `withOpening` adds the opening-stock field; the pop-up leaves it off because
 * the delivery line it lands on *is* the opening stock. `editing` locks it,
 * since stock on an existing product moves through an adjustment.
 *
 * The two sections sit side by side once the form itself is 48rem wide — a
 * container query, so the full-width page gets columns and the pop-up, at the
 * same screen width, stays stacked.
 */
export function ProductFields({ form, set, errors = {}, withOpening = true, editing = false }) {
  const price = Number(form.price)
  const cost = Number(form.cost)
  const margin = price > 0 && cost > 0 ? ((price - cost) / price) * 100 : null

  return (
    <div className="@container">
      <div className="grid gap-7 @3xl:grid-cols-2 @3xl:gap-10">
        <div>
          <p className="eyebrow mb-3 text-muted">Details</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Product name" required error={errors.name} className="sm:col-span-2">
              {(props) => (
                <Input {...props} value={form.name} onChange={set('name')} error={errors.name} placeholder="e.g. Orange juice 1L" />
              )}
            </Field>
            <Field label="SKU" required error={errors.sku} hint="Printed on the shelf label and barcode.">
              {(props) => <Input {...props} value={form.sku} onChange={set('sku')} error={errors.sku} placeholder="BEV-1005" />}
            </Field>
            <Field label="Category">
              {(props) => (
                <Select {...props} value={form.category} onChange={set('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Unit">
              {(props) => (
                <Select {...props} value={form.unit} onChange={set('unit')}>
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Reorder level" hint="A shop below this shows as low stock.">
              {(props) => <Input {...props} type="number" min="0" value={form.min} onChange={set('min')} placeholder="10" />}
            </Field>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3 text-muted">{withOpening ? 'Prices & stock' : 'Prices'}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sale price (SAR)" required error={errors.price} hint="Before 15% VAT.">
              {(props) => (
                <Input {...props} type="number" min="0" step="0.01" value={form.price} onChange={set('price')} error={errors.price} placeholder="0.00" />
              )}
            </Field>
            <Field label="Cost price (SAR)" required error={errors.cost} hint="What you pay the supplier.">
              {(props) => (
                <Input {...props} type="number" min="0" step="0.01" value={form.cost} onChange={set('cost')} error={errors.cost} placeholder="0.00" />
              )}
            </Field>
            {withOpening && (
              <Field
                label="Opening stock"
                hint={editing ? 'Change stock with an adjustment.' : 'Units already in Main warehouse.'}
              >
                {(props) => (
                  <Input {...props} type="number" min="0" value={form.opening} onChange={set('opening')} disabled={editing} placeholder="0" />
                )}
              </Field>
            )}

            {/* Margin is read off the two prices as they're typed, so a cost
                entered above the sale price shows up before it is saved. */}
            <div
              className={
                withOpening
                  ? 'flex flex-col justify-center rounded-xl border border-tint-line bg-tint px-4 py-3'
                  : 'flex flex-col justify-center rounded-xl border border-tint-line bg-tint px-4 py-3 sm:col-span-2'
              }
            >
              <p className="eyebrow text-brand-800">Margin</p>
              <p className="mt-1 text-[15px] font-bold text-ink">
                {margin === null ? '—' : `${margin.toFixed(1)}% · SAR ${(price - cost).toFixed(2)} per ${form.unit}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
