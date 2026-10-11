import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Icon from '../Icon.jsx'
import { Avatar } from '../ui/Avatar.jsx'
import { cx } from '../../lib/cx.js'
import { Sidebar } from './Sidebar.jsx'
import { Toasts } from './Toasts.jsx'
import { admin, company } from '../../data/mockData.js'

/**
 * The frame: rail, mobile drawer, content card, toast stack.
 *
 * Everything but the content card is print:hidden, so Print on an invoice
 * puts only the invoice on paper.
 */
export function AppShell({ children }) {
  const { pathname } = useLocation()
  /* The drawer remembers the path it was opened on, so any route change —
     a rail link, Back, a search hit — closes it without an effect. */
  const [drawerAt, setDrawerAt] = useState(null)
  const drawerOpen = drawerAt === pathname
  const closeDrawer = () => setDrawerAt(null)
  const menuRef = useRef(null)
  const closeRef = useRef(null)

  // Focus into the drawer on open and back to the hamburger on close; Escape closes.
  useEffect(() => {
    if (!drawerOpen) return
    const menu = menuRef.current
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setDrawerAt(null)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      menu?.focus()
    }
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-shell">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-shell/85 px-4 py-3 backdrop-blur lg:hidden print:hidden">
        <button
          ref={menuRef}
          type="button"
          onClick={() => setDrawerAt(pathname)}
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          aria-controls="nav-drawer"
          className="flex size-9.5 shrink-0 items-center justify-center rounded-full border border-brand-200 text-brand-700 transition hover:bg-brand-50 active:scale-95"
        >
          <Icon name="menu" className="size-4.5" strokeWidth={2} />
        </button>
        <div className="flex min-w-0 items-center gap-2.5">
          <img src="/CompanyLogo/logo-mark.svg" alt="" className="size-9 shrink-0" />
          <span className="truncate text-[15px] font-bold tracking-tight text-ink">{company.name}</span>
        </div>
        <Avatar initials={admin.initials} size="sm" className="ml-auto" />
      </header>

      <div className="flex">
        {/* Desktop sidebar — a brand-700 panel inset by the same lg:p-3 gutter
            the content sits in, so it reads as a floating card. The radius
            lives on the wrapper because Sidebar also renders as the mobile
            drawer, where a rounded corner would draw against the scrim. */}
        <aside className="sticky top-0 hidden h-screen w-68 shrink-0 lg:block lg:p-3 lg:pr-0 print:hidden">
          <div className="h-full overflow-hidden rounded-[26px]">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile drawer, after MeetNPlan's SidebarDrawer: always mounted so it
            can slide. Visibility flips at once on open (so focus can land in
            it) and only after the 300ms slide on close; `inert` keeps a closed
            drawer out of the tab order. */}
        <div inert={!drawerOpen} className={cx('fixed inset-0 z-40 lg:hidden', !drawerOpen && 'pointer-events-none')}>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation"
            onClick={closeDrawer}
            className={cx(
              'absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300',
              drawerOpen ? 'opacity-100' : 'opacity-0',
            )}
          />
          <div
            id="nav-drawer"
            className={cx(
              'absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-shell shadow-2xl',
              drawerOpen
                ? 'visible translate-x-0 [transition:transform_300ms_ease-out,visibility_0s]'
                : 'invisible -translate-x-full [transition:transform_300ms_ease-out,visibility_0s_300ms]',
            )}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeDrawer}
              aria-label="Close navigation"
              className="absolute top-5 right-3 z-10 flex size-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/15 hover:text-white"
            >
              <Icon name="close" className="size-4.5" />
            </button>
            <Sidebar onNavigate={closeDrawer} />
          </div>
        </div>

        {/* The card is inset from the shell on desktop only — on mobile the
            gutter would eat too much of a narrow viewport, so it goes flush. */}
        <main className="min-w-0 flex-1 lg:p-3 print:p-0">
          <div
            className={cx(
              'bg-canvas px-5 py-8 sm:px-8',
              'lg:min-h-[calc(100vh-1.5rem)] lg:rounded-[26px] lg:px-14 lg:py-11',
              'print:min-h-0 print:p-0',
            )}
          >
            <div className="max-w-[1440px]">{children}</div>
          </div>
        </main>
      </div>

      <div className="print:hidden">
        <Toasts />
      </div>
    </div>
  )
}
