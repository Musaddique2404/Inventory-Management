import { CATEGORIES } from '../../data/mockData.js'

/** A blank product form. Numbers are kept as strings while typed. */
export const EMPTY_PRODUCT = {
  name: '',
  sku: '',
  category: CATEGORIES[0],
  unit: 'pcs',
  min: '',
  price: '',
  cost: '',
  opening: '',
}

/** The checks a product form can make without a server. Empty object = valid. */
export function productErrors(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Give the product a name.'
  if (!form.sku.trim()) errors.sku = 'A SKU is required.'
  if (!(Number(form.price) > 0)) errors.price = 'Enter a sale price.'
  if (!(Number(form.cost) > 0)) errors.cost = 'Enter a cost price.'
  return errors
}
