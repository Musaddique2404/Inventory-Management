import {
  TODAY,
  adjustments,
  branches,
  products,
  sales,
  stockIns,
  transfers,
} from '../data/mockData.js'
import { isSameDay } from './format.js'

/**
 * Inventory rules, kept out of the pages. The list, the detail page, the rail
 * badge and the shop cards all ask "is this low?" — one predicate here means
 * they can never disagree about it.
 */

export const VAT_RATE = 0.15

export const productById = (id) => products.find((p) => p.id === id)
export const branchById = (id) => branches.find((b) => b.id === id)

export function totalStock(product) {
  return Object.values(product.stock).reduce((sum, n) => sum + n, 0)
}

export function minFor(product, branchId) {
  return branchId === 'main' ? product.min.main : product.min.shop
}

/** Below the reorder level at this one branch. */
export function isLowAt(product, branchId) {
  return (product.stock[branchId] ?? 0) < minFor(product, branchId)
}

/** Low anywhere — the list's red figure and the "Low stock" filter. */
export function isLow(product) {
  return branches.some((b) => isLowAt(product, b.id))
}

export const lowStockProducts = products.filter(isLow)

export function lowStockAt(branchId) {
  return products.filter((p) => isLowAt(p, branchId))
}

export function unitsAt(branchId) {
  return products.reduce((sum, p) => sum + (p.stock[branchId] ?? 0), 0)
}

/** Stock value at cost. */
export function stockValueAt(branchId) {
  return products.reduce((sum, p) => sum + (p.stock[branchId] ?? 0) * p.cost, 0)
}

export function marginOf(product) {
  return (product.price - product.cost) / product.price
}

export function units(items) {
  return items.reduce((sum, i) => sum + i.qty, 0)
}

/** Subtotal, VAT and total for sale lines priced VAT-exclusive. */
export function saleTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0)
  const vat = subtotal * VAT_RATE
  return { subtotal, vat, total: subtotal + vat }
}

/** Stock-in lines carry their own unit cost. */
export function costTotal(items) {
  return items.reduce((sum, i) => sum + i.qty * i.cost, 0)
}

/** Transfer lines are valued at the product's current cost. */
export function transferValue(items) {
  return items.reduce((sum, i) => sum + i.qty * (productById(i.productId)?.cost ?? 0), 0)
}

export const salesToday = sales.filter((s) => isSameDay(s.at, TODAY))

export function salesTodayAt(branchId) {
  return salesToday
    .filter((s) => s.branchId === branchId)
    .reduce((sum, s) => sum + saleTotals(s.items).total, 0)
}

/** Units sent to a shop in the seven days up to TODAY. */
export function unitsSentThisWeek(shopId) {
  return transfers
    .filter((t) => t.shopId === shopId && TODAY - t.at <= 7 * 864e5)
    .reduce((sum, t) => sum + units(t.items), 0)
}

/**
 * Every movement of one product, newest first — stock in, transfers, sales and
 * adjustments folded into one ledger for the product detail page. `qty` is
 * signed from the point of view of the branch named in `where`.
 */
export function movementsFor(productId) {
  const rows = []

  for (const doc of stockIns) {
    for (const line of doc.items.filter((i) => i.productId === productId)) {
      rows.push({ key: `${doc.id}`, kind: 'Stock in', ref: doc.id, at: doc.at, where: 'Main warehouse', qty: line.qty, detail: doc.supplier })
    }
  }
  for (const doc of transfers) {
    for (const line of doc.items.filter((i) => i.productId === productId)) {
      rows.push({ key: `${doc.id}`, kind: 'Transfer', ref: doc.id, at: doc.at, where: `Main → ${branchById(doc.shopId).name}`, qty: line.qty, detail: doc.status })
    }
  }
  for (const doc of sales) {
    for (const line of doc.items.filter((i) => i.productId === productId)) {
      rows.push({ key: `${doc.id}`, kind: 'Sale', ref: doc.id, at: doc.at, where: branchById(doc.branchId).name, qty: -line.qty, detail: doc.customer.name })
    }
  }
  for (const doc of adjustments.filter((a) => a.productId === productId)) {
    rows.push({ key: doc.id, kind: doc.type, ref: doc.id, at: doc.at, where: branchById(doc.branchId).name, qty: doc.qty, detail: doc.reason })
  }

  return rows.sort((a, b) => b.at - a.at)
}

/** "INV-OL-00232" — the next number for a shop's sales series. */
export function nextInvoiceNumber(branchId) {
  const branch = branchById(branchId)
  const last = sales
    .filter((s) => s.branchId === branchId)
    .map((s) => Number(s.id.split('-').pop()))
    .reduce((max, n) => Math.max(max, n), 0)
  return `INV-${branch.prefix}-${String(last + 1).padStart(5, '0')}`
}
