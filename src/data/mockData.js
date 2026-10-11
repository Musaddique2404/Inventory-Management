/**
 * Sample data for the UI prototype. There is no backend: every page reads from
 * here, and forms report through a toast instead of saving.
 */

export const TODAY = new Date(2026, 9, 9, 12, 0) // Friday, 9 October 2026

export const company = {
  name: 'Al Noor Trading',
  legalName: 'Al Noor Trading Est.',
  vatNumber: '310 245 678 900 003',
  crNumber: '2050 123 456',
  phone: '+966 13 812 4400',
  email: 'info@alnoor.sa',
  address: 'King Saud St, Al Faisaliyah, Dammam 32272',
}

export const admin = {
  name: 'Musaddique Khan',
  initials: 'MK',
  email: 'admin@alnoor.sa',
  role: 'Owner',
}

/** Main is the warehouse every stock-in lands in; the shops sell. */
export const branches = [
  {
    id: 'main',
    name: 'Main warehouse',
    type: 'warehouse',
    address: 'Second Industrial City, Dammam',
    manager: 'Faisal Al-Harbi',
    phone: '+966 55 300 1200',
    prefix: 'MN',
  },
  {
    id: 'olaya',
    name: 'Olaya shop',
    type: 'shop',
    address: 'Olaya St, Al Khobar',
    manager: 'Sara Al-Qahtani',
    phone: '+966 55 300 1201',
    prefix: 'OL',
  },
  {
    id: 'faisaliyah',
    name: 'Faisaliyah shop',
    type: 'shop',
    address: 'King Saud St, Dammam',
    manager: 'Omar Siddiqui',
    phone: '+966 55 300 1202',
    prefix: 'FS',
  },
  {
    id: 'jubail',
    name: 'Jubail shop',
    type: 'shop',
    address: 'Jeddah St, Al Jubail',
    manager: 'Hassan Malik',
    phone: '+966 55 300 1203',
    prefix: 'JB',
  },
]

export const shops = branches.filter((b) => b.type === 'shop')

export const CATEGORIES = ['Beverages', 'Snacks', 'Household', 'Personal care']
export const UNITS = ['pcs', 'bottle', 'box', 'carton', 'pack', 'bag', 'jar', 'tube']

/**
 * `stock` is units per branch. `min` is the reorder level — one figure for the
 * warehouse, one shared by every shop.
 */
export const products = [
  { id: 'p1', name: 'Orange juice 1L', sku: 'BEV-1001', category: 'Beverages', unit: 'bottle', price: 7.5, cost: 5.2, min: { main: 60, shop: 12 }, stock: { main: 240, olaya: 36, faisaliyah: 8, jubail: 22 } },
  { id: 'p2', name: 'Mineral water 330ml × 40', sku: 'BEV-1002', category: 'Beverages', unit: 'carton', price: 21, cost: 15.5, min: { main: 40, shop: 10 }, stock: { main: 180, olaya: 24, faisaliyah: 30, jubail: 18 } },
  { id: 'p3', name: 'Instant coffee 200g', sku: 'BEV-1003', category: 'Beverages', unit: 'jar', price: 32.95, cost: 24.1, min: { main: 20, shop: 6 }, stock: { main: 64, olaya: 9, faisaliyah: 14, jubail: 4 } },
  { id: 'p4', name: 'Black tea, 100 bags', sku: 'BEV-1004', category: 'Beverages', unit: 'box', price: 18.5, cost: 12.8, min: { main: 30, shop: 8 }, stock: { main: 120, olaya: 20, faisaliyah: 16, jubail: 12 } },
  { id: 'p5', name: 'Potato chips, salted 170g', sku: 'SNK-2001', category: 'Snacks', unit: 'pack', price: 9.25, cost: 6.1, min: { main: 80, shop: 15 }, stock: { main: 300, olaya: 48, faisaliyah: 52, jubail: 40 } },
  { id: 'p6', name: 'Milk chocolate bar 90g', sku: 'SNK-2002', category: 'Snacks', unit: 'pcs', price: 6, cost: 3.9, min: { main: 60, shop: 12 }, stock: { main: 22, olaya: 30, faisaliyah: 18, jubail: 25 } },
  { id: 'p7', name: 'Assorted biscuits 400g', sku: 'SNK-2003', category: 'Snacks', unit: 'box', price: 14.75, cost: 9.6, min: { main: 30, shop: 8 }, stock: { main: 90, olaya: 15, faisaliyah: 3, jubail: 10 } },
  { id: 'p8', name: 'Dish soap, lemon 1L', sku: 'HOU-3001', category: 'Household', unit: 'bottle', price: 12.5, cost: 8.4, min: { main: 40, shop: 10 }, stock: { main: 140, olaya: 26, faisaliyah: 20, jubail: 15 } },
  { id: 'p9', name: 'Laundry powder 3kg', sku: 'HOU-3002', category: 'Household', unit: 'bag', price: 39.9, cost: 29, min: { main: 20, shop: 5 }, stock: { main: 45, olaya: 6, faisaliyah: 9, jubail: 7 } },
  { id: 'p10', name: 'Bleach 1.89L', sku: 'HOU-3003', category: 'Household', unit: 'bottle', price: 11.25, cost: 7.3, min: { main: 25, shop: 8 }, stock: { main: 80, olaya: 2, faisaliyah: 12, jubail: 9 } },
  { id: 'p11', name: 'Anti-dandruff shampoo 400ml', sku: 'PER-4001', category: 'Personal care', unit: 'bottle', price: 24.95, cost: 17.2, min: { main: 20, shop: 6 }, stock: { main: 58, olaya: 14, faisaliyah: 11, jubail: 6 } },
  { id: 'p12', name: 'Toothpaste 100ml', sku: 'PER-4002', category: 'Personal care', unit: 'tube', price: 10.5, cost: 6.75, min: { main: 40, shop: 10 }, stock: { main: 150, olaya: 28, faisaliyah: 25, jubail: 20 } },
]

export const suppliers = [
  'Gulf Foods Distribution',
  'Eastern Home Supplies',
  'Al Sharq Trading',
  'Care Plus Wholesale',
]

/** Deliveries from suppliers, newest first. Always received into Main. */
export const stockIns = [
  { id: 'SI-1048', at: new Date(2026, 9, 8, 9, 15), supplier: 'Gulf Foods Distribution', supplierInvoice: 'GFD-77120', items: [{ productId: 'p1', qty: 120, cost: 5.2 }, { productId: 'p2', qty: 60, cost: 15.5 }, { productId: 'p5', qty: 100, cost: 6.1 }] },
  { id: 'SI-1047', at: new Date(2026, 9, 5, 10, 40), supplier: 'Eastern Home Supplies', supplierInvoice: 'EHS-3391', items: [{ productId: 'p8', qty: 80, cost: 8.4 }, { productId: 'p9', qty: 30, cost: 29 }, { productId: 'p10', qty: 50, cost: 7.3 }] },
  { id: 'SI-1046', at: new Date(2026, 9, 1, 8, 50), supplier: 'Al Sharq Trading', supplierInvoice: 'AST-10452', items: [{ productId: 'p3', qty: 40, cost: 24.1 }, { productId: 'p4', qty: 60, cost: 12.8 }] },
  { id: 'SI-1045', at: new Date(2026, 8, 27, 11, 5), supplier: 'Care Plus Wholesale', supplierInvoice: 'CPW-5520', items: [{ productId: 'p11', qty: 36, cost: 17.2 }, { productId: 'p12', qty: 96, cost: 6.75 }] },
  { id: 'SI-1044', at: new Date(2026, 8, 22, 9, 30), supplier: 'Gulf Foods Distribution', supplierInvoice: 'GFD-76844', items: [{ productId: 'p6', qty: 120, cost: 3.9 }, { productId: 'p7', qty: 48, cost: 9.6 }] },
]

/** Warehouse → shop. A record of what was sent, valued at cost. */
export const transfers = [
  { id: 'TR-2056', at: new Date(2026, 9, 9, 9, 40), shopId: 'olaya', status: 'In transit', by: 'Faisal Al-Harbi', note: 'Weekend restock — juice and bleach running low.', items: [{ productId: 'p1', qty: 24 }, { productId: 'p5', qty: 24 }, { productId: 'p10', qty: 12 }] },
  { id: 'TR-2055', at: new Date(2026, 9, 8, 14, 20), shopId: 'faisaliyah', status: 'Delivered', by: 'Faisal Al-Harbi', note: '', items: [{ productId: 'p2', qty: 20 }, { productId: 'p6', qty: 24 }, { productId: 'p8', qty: 12 }] },
  { id: 'TR-2054', at: new Date(2026, 9, 6, 10, 5), shopId: 'jubail', status: 'Delivered', by: 'Faisal Al-Harbi', note: '', items: [{ productId: 'p3', qty: 6 }, { productId: 'p4', qty: 10 }, { productId: 'p12', qty: 12 }] },
  { id: 'TR-2053', at: new Date(2026, 9, 3, 16, 45), shopId: 'olaya', status: 'Delivered', by: 'Faisal Al-Harbi', note: 'Shampoo promo stock.', items: [{ productId: 'p9', qty: 6 }, { productId: 'p11', qty: 8 }] },
  { id: 'TR-2052', at: new Date(2026, 8, 30, 11, 0), shopId: 'faisaliyah', status: 'Delivered', by: 'Faisal Al-Harbi', note: '', items: [{ productId: 'p5', qty: 30 }, { productId: 'p7', qty: 10 }] },
]

export const PAYMENT_METHODS = ['Cash', 'Card', 'Bank transfer']
export const PAYMENT_ICON = { Cash: 'cash', Card: 'card', 'Bank transfer': 'bank' }

const WALK_IN = { name: 'Walk-in customer', phone: '' }

/** Shop sales, newest first. Prices are VAT-exclusive; 15% is added on the invoice. */
export const sales = [
  { id: 'INV-OL-00231', branchId: 'olaya', at: new Date(2026, 9, 9, 11, 42), customer: { name: 'Ahmed Al-Ghamdi', phone: '+966 55 210 3344' }, payment: 'Card', items: [{ productId: 'p1', qty: 4, price: 7.5 }, { productId: 'p5', qty: 3, price: 9.25 }, { productId: 'p6', qty: 2, price: 6 }] },
  { id: 'INV-FS-00187', branchId: 'faisaliyah', at: new Date(2026, 9, 9, 11, 15), customer: WALK_IN, payment: 'Cash', items: [{ productId: 'p2', qty: 1, price: 21 }, { productId: 'p12', qty: 2, price: 10.5 }] },
  { id: 'INV-JB-00094', branchId: 'jubail', at: new Date(2026, 9, 9, 10, 58), customer: { name: 'Noura Al-Shehri', phone: '+966 50 778 1290' }, payment: 'Bank transfer', items: [{ productId: 'p9', qty: 2, price: 39.9 }, { productId: 'p8', qty: 3, price: 12.5 }, { productId: 'p10', qty: 1, price: 11.25 }] },
  { id: 'INV-OL-00230', branchId: 'olaya', at: new Date(2026, 9, 9, 10, 21), customer: WALK_IN, payment: 'Cash', items: [{ productId: 'p3', qty: 1, price: 32.95 }, { productId: 'p4', qty: 2, price: 18.5 }] },
  { id: 'INV-FS-00186', branchId: 'faisaliyah', at: new Date(2026, 9, 9, 9, 47), customer: { name: 'Khalid Rahman', phone: '+966 56 441 0098' }, payment: 'Card', items: [{ productId: 'p11', qty: 2, price: 24.95 }, { productId: 'p12', qty: 1, price: 10.5 }, { productId: 'p6', qty: 4, price: 6 }] },
  { id: 'INV-OL-00229', branchId: 'olaya', at: new Date(2026, 9, 8, 20, 34), customer: WALK_IN, payment: 'Card', items: [{ productId: 'p7', qty: 2, price: 14.75 }, { productId: 'p5', qty: 2, price: 9.25 }] },
  { id: 'INV-JB-00093', branchId: 'jubail', at: new Date(2026, 9, 8, 18, 5), customer: { name: 'Fatima Zahra', phone: '+966 54 902 3311' }, payment: 'Cash', items: [{ productId: 'p1', qty: 6, price: 7.5 }, { productId: 'p2', qty: 2, price: 21 }] },
  { id: 'INV-FS-00185', branchId: 'faisaliyah', at: new Date(2026, 9, 8, 13, 12), customer: WALK_IN, payment: 'Card', items: [{ productId: 'p4', qty: 1, price: 18.5 }, { productId: 'p8', qty: 2, price: 12.5 }] },
]

export const ADJUSTMENT_TYPES = ['Damaged', 'Return', 'Count fix']

/** Stock corrections. `qty` is signed: negative takes stock out. */
export const adjustments = [
  { id: 'ADJ-0318', at: new Date(2026, 9, 8, 15, 30), type: 'Damaged', branchId: 'faisaliyah', productId: 'p8', qty: -2, before: 22, reason: 'Two bottles leaked in delivery.', by: 'Omar Siddiqui' },
  { id: 'ADJ-0317', at: new Date(2026, 9, 7, 12, 10), type: 'Return', branchId: 'olaya', productId: 'p11', qty: 1, before: 13, reason: 'Customer return, unopened.', by: 'Sara Al-Qahtani' },
  { id: 'ADJ-0316', at: new Date(2026, 9, 5, 18, 0), type: 'Count fix', branchId: 'main', productId: 'p6', qty: -4, before: 26, reason: 'Monthly shelf count.', by: 'Faisal Al-Harbi' },
  { id: 'ADJ-0315', at: new Date(2026, 9, 2, 9, 20), type: 'Damaged', branchId: 'jubail', productId: 'p3', qty: -1, before: 5, reason: 'Broken jar on the shelf.', by: 'Hassan Malik' },
]

/** Sales per day for the last seven days, Sat → Fri, in SAR (VAT-exclusive). Friday is today, so far. */
export const weeklySales = [
  { day: 'Sat', total: 6420 },
  { day: 'Sun', total: 5180 },
  { day: 'Mon', total: 4870 },
  { day: 'Tue', total: 5310 },
  { day: 'Wed', total: 5960 },
  { day: 'Thu', total: 7240 },
  { day: 'Fri', total: 395 },
]

export const users = [
  { id: 'u1', name: 'Musaddique Khan', initials: 'MK', email: 'admin@alnoor.sa', role: 'Owner', branch: 'All branches' },
  { id: 'u2', name: 'Faisal Al-Harbi', initials: 'FH', email: 'faisal@alnoor.sa', role: 'Warehouse manager', branch: 'Main warehouse' },
  { id: 'u3', name: 'Sara Al-Qahtani', initials: 'SQ', email: 'sara@alnoor.sa', role: 'Shop manager', branch: 'Olaya shop' },
  { id: 'u4', name: 'Omar Siddiqui', initials: 'OS', email: 'omar@alnoor.sa', role: 'Shop manager', branch: 'Faisaliyah shop' },
  { id: 'u5', name: 'Hassan Malik', initials: 'HM', email: 'hassan@alnoor.sa', role: 'Cashier', branch: 'Jubail shop' },
]

/** Document numbering. Sales take one prefix per shop; the rest are company-wide. */
export const invoicePrefixes = [
  { id: 'sale-olaya', label: 'Sales · Olaya shop', prefix: 'INV-OL-', next: 232 },
  { id: 'sale-faisaliyah', label: 'Sales · Faisaliyah shop', prefix: 'INV-FS-', next: 188 },
  { id: 'sale-jubail', label: 'Sales · Jubail shop', prefix: 'INV-JB-', next: 95 },
  { id: 'stock-in', label: 'Stock in', prefix: 'SI-', next: 1049 },
  { id: 'transfer', label: 'Transfers', prefix: 'TR-', next: 2057 },
  { id: 'adjustment', label: 'Adjustments', prefix: 'ADJ-', next: 319 },
]

/** Bell contents. `kind` keys into NOTIFICATION_KINDS for the icon and tone. */
export const initialNotifications = [
  { id: 'n1', kind: 'low', title: 'Low stock at Olaya shop', body: 'Bleach 1.89L — 2 left, minimum is 8.', at: '20 min ago', read: false },
  { id: 'n2', kind: 'transfer', title: 'Transfer TR-2056 sent', body: '60 units on the way to Olaya shop.', at: '2 hours ago', read: false },
  { id: 'n3', kind: 'low', title: 'Low stock in Main warehouse', body: 'Milk chocolate bar 90g — 22 left, minimum is 60.', at: '3 hours ago', read: false },
  { id: 'n4', kind: 'stockIn', title: 'Stock in SI-1048 received', body: '280 units into Main warehouse from Gulf Foods.', at: 'Yesterday', read: true },
  { id: 'n5', kind: 'adjustment', title: 'Adjustment ADJ-0318', body: 'Faisaliyah shop wrote off 2 × Dish soap, lemon 1L.', at: 'Yesterday', read: true },
]

export const NOTIFICATION_KINDS = {
  low: { icon: 'alert', tone: 'danger' },
  transfer: { icon: 'truck', tone: 'brand' },
  stockIn: { icon: 'inbox', tone: 'success' },
  adjustment: { icon: 'clipboard', tone: 'warn' },
}

/** The same seven days, split by shop and by payment method. Each sums to weeklySales. */
export const weeklyByShop = [
  { branchId: 'olaya', total: 14680 },
  { branchId: 'faisaliyah', total: 12040 },
  { branchId: 'jubail', total: 8655 },
]

export const weeklyByPayment = [
  { method: 'Card', total: 18750 },
  { method: 'Cash', total: 13445 },
  { method: 'Bank transfer', total: 3180 },
]

export const WEEK_INVOICES = 376

/** Best sellers over the same seven days, by units. */
export const topProducts = [
  { productId: 'p5', units: 186 },
  { productId: 'p1', units: 164 },
  { productId: 'p6', units: 140 },
  { productId: 'p2', units: 92 },
  { productId: 'p12', units: 88 },
]
