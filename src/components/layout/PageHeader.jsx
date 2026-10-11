import { useNavigate } from 'react-router-dom'
import Icon from '../Icon.jsx'
import { Button } from '../ui/Button.jsx'
import { NotificationsBell } from './NotificationsBell.jsx'
import { SearchBox } from './SearchBox.jsx'
import { ROUTES } from '../../lib/nav.js'

/**
 * Page title + global chrome, rendered by every screen.
 *
 * `back` is the path the arrow returns to — a detail or form page names its
 * list explicitly rather than calling history.back(), so a deep link still has
 * somewhere sensible to go.
 *
 * `action` replaces the default "New sale" button; pass `action={null}` on a
 * page where offering it again is noise.
 */
export function PageHeader({ title, subtitle, back, action }) {
  const navigate = useNavigate()

  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div className="flex min-w-0 items-center gap-4">
        {back && (
          <button
            type="button"
            onClick={() => navigate(back)}
            aria-label="Back"
            className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-panel text-ink transition hover:bg-surface"
          >
            <Icon name="arrowLeft" className="size-4.5" strokeWidth={1.9} />
          </button>
        )}
        <div className="min-w-0">
          {/* The one place the display face appears: Manrope at weight 800. */}
          <h1 className="font-display text-[30px] leading-tight font-extrabold tracking-tight text-ink">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox />
        <NotificationsBell />

        {action === undefined ? (
          <Button icon="plus" onClick={() => navigate(ROUTES.newSale)} className="max-sm:hidden">
            New sale
          </Button>
        ) : (
          action
        )}
      </div>
    </div>
  )
}
