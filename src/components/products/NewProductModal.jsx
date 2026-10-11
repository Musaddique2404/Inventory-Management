import { useState } from 'react'
import { Button, Modal } from '../ui/index.js'
import { ProductFields } from './ProductFields.jsx'
import { EMPTY_PRODUCT, productErrors } from './product.js'

let seq = 0

/**
 * The "New product" pop-up on Stock in — for a delivery that brings something
 * not yet in the system. Adding it hands the product straight to the delivery
 * as a new line; there is no separate trip to Products.
 */
export function NewProductModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [touched, setTouched] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const errors = touched ? productErrors(form) : {}

  const close = () => {
    setForm(EMPTY_PRODUCT)
    setTouched(false)
    onClose()
  }

  const add = () => {
    setTouched(true)
    if (Object.keys(productErrors(form)).length) return
    onAdd({
      id: `new-${++seq}`,
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category,
      unit: form.unit,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: { main: 0 },
      isNew: true,
    })
    close()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      size="xl"
      title="New product"
      description="Not in the system yet? Add it here and it goes straight onto this delivery."
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button icon="plus" onClick={add}>
            Add to delivery
          </Button>
        </>
      }
    >
      <ProductFields form={form} set={set} errors={errors} withOpening={false} />
    </Modal>
  )
}
