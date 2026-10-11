import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../Icon.jsx'
import { IconTile } from '../ui/IconTile.jsx'
import { Popover } from '../ui/Popover.jsx'
import { cx } from '../../lib/cx.js'
import { useDismiss } from '../../hooks/useDismiss.js'
import { products, sales, transfers } from '../../data/mockData.js'
import { NAV_ITEMS, ROUTES } from '../../lib/nav.js'
import { branchById } from '../../lib/stock.js'

/** Global search: pages, products by name or SKU, and invoice / transfer numbers. */
export function SearchBox() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const has = (text) => text.toLowerCase().includes(q)

    const pages = NAV_ITEMS.filter((item) => has(item.label)).map((item) => ({
      key: `page-${item.key}`,
      icon: item.icon,
      label: item.label,
      hint: 'Page',
      to: item.path,
    }))

    const items = products
      .filter((p) => has(`${p.name} ${p.sku}`))
      .map((p) => ({ key: p.id, icon: 'box', label: p.name, hint: `Product · ${p.sku}`, to: `${ROUTES.products}/${p.id}` }))

    const invoices = sales
      .filter((s) => has(`${s.id} ${s.customer.name}`))
      .map((s) => ({ key: s.id, icon: 'receipt', label: s.id, hint: `Sale · ${branchById(s.branchId).name}`, to: `${ROUTES.sales}/${s.id}` }))

    const sent = transfers
      .filter((t) => has(t.id))
      .map((t) => ({ key: t.id, icon: 'truck', label: t.id, hint: `Transfer · ${branchById(t.shopId).name}`, to: `${ROUTES.transfers}/${t.id}` }))

    return [...pages, ...items, ...invoices, ...sent].slice(0, 8)
  }, [query])

  const select = (result) => {
    navigate(result.to)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative max-lg:hidden" ref={ref}>
      <div
        className={cx(
          'flex w-55 items-center gap-2.5 rounded-[10px] border bg-panel px-3.5 py-2.5 transition',
          open ? 'border-brand-500' : 'border-line',
        )}
      >
        <Icon name="search" className="size-4 shrink-0 text-faint" strokeWidth={1.9} />
        <input
          value={query}
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results.length) select(results[0])
          }}
          className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-faint"
        />
      </div>

      {open && query.trim() && (
        <Popover>
          {results.length === 0 ? (
            <p className="px-4 py-5 text-center text-[13px] text-muted">Nothing matches “{query.trim()}”.</p>
          ) : (
            results.map((result) => (
              <button
                key={result.key}
                type="button"
                onClick={() => select(result)}
                className="flex w-full items-center gap-3 border-b border-line-soft px-4 py-3 text-left transition last:border-0 hover:bg-surface"
              >
                <IconTile name={result.icon} tone="neutral" size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-ink">{result.label}</span>
                  <span className="block truncate text-xs text-muted">{result.hint}</span>
                </span>
              </button>
            ))
          )}
        </Popover>
      )}
    </div>
  )
}
