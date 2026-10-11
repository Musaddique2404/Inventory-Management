/**
 * The route table — the single source for paths, the sidebar rail and global
 * search.
 *
 * The rail renders NAV_GROUPS in order, each under its eyebrow. Adding a page
 * means one entry here plus one <Route> in app/routes.jsx, and it appears in the
 * rail and in search automatically.
 */

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { key: 'dashboard', path: '/', label: 'Dashboard', icon: 'overview' },
      { key: 'reports', path: '/reports', label: 'Reports', icon: 'chart' },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { key: 'products', path: '/products', label: 'Products', icon: 'box' },
      { key: 'stockIn', path: '/stock-in', label: 'Stock in', icon: 'inbox' },
      { key: 'transfers', path: '/transfers', label: 'Transfers', icon: 'truck' },
      { key: 'adjustments', path: '/adjustments', label: 'Adjustments', icon: 'clipboard' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { key: 'sales', path: '/sales', label: 'Sales', icon: 'receipt' },
      { key: 'shops', path: '/shops', label: 'Shops', icon: 'store' },
    ],
  },
  {
    label: 'System',
    items: [{ key: 'settings', path: '/settings', label: 'Settings', icon: 'settings' }],
  },
]

export const PRIMARY_NAV = NAV_GROUPS.flatMap((group) => group.items)

/**
 * The "new document" forms. Not rail items — each is reached from its list
 * page's header button (and New sale from the rail's own button) — but search
 * covers them, so "new transfer" typed anywhere lands on the form.
 */
export const HIDDEN_NAV = [
  { key: 'newSale', path: '/sales/new', label: 'New sale', icon: 'plus' },
  { key: 'newStockIn', path: '/stock-in/new', label: 'New stock in', icon: 'plus' },
  { key: 'newTransfer', path: '/transfers/new', label: 'New transfer', icon: 'plus' },
  { key: 'newProduct', path: '/products/new', label: 'Add product', icon: 'plus' },
]

/** Sidebar renders NAV_GROUPS only; search covers hidden routes too. */
export const NAV_ITEMS = [...PRIMARY_NAV, ...HIDDEN_NAV]

/** Named paths, so call sites navigate to ROUTES.sales rather than a bare string. */
export const ROUTES = Object.fromEntries(NAV_ITEMS.map((item) => [item.key, item.path]))
