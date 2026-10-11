import { useMemo, useState } from 'react'
import { IconTile, Input, Popover, cx } from '../ui/index.js'
import { useDismiss } from '../../hooks/useDismiss.js'
import { products } from '../../data/mockData.js'
import { formatMoney } from '../../lib/format.js'
import { branchById, isLowAt } from '../../lib/stock.js'

/**
 * The "add a line" search on every document form — stock in, transfers and
 * sales. Opens on focus with the whole catalogue, narrows as you type a name or
 * SKU, and Enter takes the top match, so a barcode scanner (which types the
 * code and presses Enter) works without any scanner-specific code.
 *
 * Each result shows the stock at `branchId`, since that is the figure the line
 * is about to draw on. `exclude` hides products already on the document.
 */
export function ProductPicker({
  onPick,
  branchId = 'main',
  exclude = [],
  icon = 'search',
  placeholder = 'Search products by name or SKU',
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const branch = branchById(branchId)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => !exclude.includes(p.id))
      .filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(q))
      .slice(0, 7)
  }, [query, exclude])

  const pick = (product) => {
    onPick(product)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <Input
        icon={icon}
        value={query}
        placeholder={placeholder}
        aria-label={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (results.length) pick(results[0])
          }
        }}
      />

      {open && (
        <Popover width="w-full" className="left-0">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-center text-[13px] text-muted">
              {query.trim() ? `No product matches “${query.trim()}”.` : 'Every product is already on this list.'}
            </p>
          ) : (
            <div className="scrollbar-slim max-h-80 overflow-y-auto">
              {results.map((p) => {
                const onHand = p.stock?.[branchId] ?? 0
                const low = isLowAt(p, branchId)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pick(p)}
                    className="flex w-full items-center gap-3 border-b border-line-soft px-4 py-3 text-left transition last:border-0 hover:bg-surface"
                  >
                    <IconTile name="box" tone="neutral" size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-ink">{p.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {p.sku} · {formatMoney(p.price)}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className={cx('block text-[13px] font-semibold', low ? 'text-[#af2030]' : 'text-ink')}>
                        {onHand}
                      </span>
                      <span className="block text-[11px] text-muted">in {branch.type === 'warehouse' ? 'Main' : 'shop'}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </Popover>
      )}
    </div>
  )
}
