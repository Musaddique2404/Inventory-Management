import { NavLink, useNavigate } from 'react-router-dom'
import Icon from '../Icon.jsx'
import { Avatar } from '../ui/Avatar.jsx'
import { Button } from '../ui/Button.jsx'
import { cx } from '../../lib/cx.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { admin, company } from '../../data/mockData.js'
import { NAV_GROUPS, ROUTES } from '../../lib/nav.js'
import { lowStockProducts } from '../../lib/stock.js'

/**
 * A rail destination.
 *
 * NavLink rather than a button, so these are real anchors and the active state
 * comes from the router. Without `end` a list route stays active on its detail
 * and form pages too — /products/p1 lights up Products, which is what we want.
 */
function NavItem({ item, badge, onSelect }) {
  return (
    <NavLink
      to={item.path}
      // `end` only on "/" — without it the root route matches every path and
      // Dashboard would render as active on every page.
      end={item.path === ROUTES.dashboard}
      onClick={onSelect}
      className={({ isActive }) =>
        cx(
          'group relative flex w-full items-center gap-3.5 rounded-xl py-2.5 pr-3 pl-4 text-[15px] transition',
          // The rail is a brand-700 panel, so states are white washes over the
          // fill rather than ramp steps — a step fill would read as a second
          // panel, not a state.
          'focus-visible:outline-white',
          isActive ? 'bg-white/15 font-semibold text-white' : 'font-medium text-white hover:bg-white/10',
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active marker, seated on the pill's own left edge. */}
          <span
            className={cx(
              'absolute inset-y-3 left-0 w-[3px] rounded-full bg-brand-200 transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
          <Icon
            name={item.icon}
            strokeWidth={1.8}
            className={cx(
              'size-5 shrink-0 transition',
              isActive ? 'text-white' : 'text-brand-100 group-hover:text-white',
            )}
          />
          <span className="flex-1 truncate text-left">{item.label}</span>
          {badge > 0 && (
            <span
              title={`${badge} products low on stock`}
              className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-200 px-1.5 text-[12px] font-semibold text-on-brand-dark"
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

function NavSection({ label, children }) {
  return (
    <div>
      <p className="eyebrow mb-1.5 px-4 text-brand-100">{label}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

export function Sidebar({ onNavigate }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    onNavigate?.() // close the mobile drawer before we leave the shell
    signOut()
    navigate('/login', { replace: true })
  }

  /* bg-brand-700 — the Primary step. Everything inside follows from that one
     choice: text is white, secondary text is brand-100, dividers and state
     fills are white washes, and the focus ring flips to white because the
     default brand-700 ring would vanish into its own panel. overflow-y-auto is
     a fallback for very short windows only. */
  return (
    <div className="scrollbar-slim flex h-full flex-col overflow-y-auto bg-brand-700 px-3.5 py-5">
      {/* Company — the tenant's logo and name head the rail. */}
      <div className="mb-5 flex items-center gap-3 px-2">
        <img src="/CompanyLogo/logo-mark.svg" alt="" className="size-11 shrink-0 rounded-[13px] ring-1 ring-white/25" />
        <div className="min-w-0">
          <p className="truncate text-[17px] leading-tight font-bold tracking-tight text-white">{company.name}</p>
          <p className="mt-0.5 truncate text-[12.5px] text-brand-100">Inventory management</p>
        </div>
      </div>

      {/* New sale is reachable from every page — the one action a shop does
          all day — so it lives in the rail rather than on one page. */}
      <Button
        variant="onDark"
        size="lg"
        icon="plus"
        fullWidth
        onClick={() => {
          navigate(ROUTES.newSale)
          onNavigate?.()
        }}
        className="focus-visible:outline-white"
      >
        New sale
      </Button>

      <nav className="mt-6 flex flex-col gap-5">
        {NAV_GROUPS.map((group) => (
          <NavSection key={group.label} label={group.label}>
            {group.items.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                badge={item.key === 'products' ? lowStockProducts.length : 0}
                onSelect={onNavigate}
              />
            ))}
          </NavSection>
        ))}
      </nav>

      {/* Who is signed in, and the way out. Log out is a quiet white wash, not
          danger red — on the dark panel a red fill would be the loudest thing
          in the column. */}
      <div className="mt-auto border-t border-white/20 pt-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar initials={admin.initials} tone="deep" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-white">{admin.name}</p>
            <p className="truncate text-[12.5px] text-brand-100">{admin.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-white/12 py-3 text-[15px] font-semibold text-white transition hover:bg-white/20 focus-visible:outline-white"
        >
          <Icon name="logout" strokeWidth={1.8} className="size-5" />
          Log out
        </button>
      </div>
    </div>
  )
}
