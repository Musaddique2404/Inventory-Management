/**
 * A list page that is at least one screen tall from lg up, so a `fill` Table
 * at its end takes the rest of the screen and scrolls its rows inside rather
 * than running the page on. 7rem is the content card's vertical chrome in
 * AppShell — main's lg:p-3 (1.5rem) plus the card's lg:py-11 (5.5rem) — so the
 * card lands exactly on the bottom of the screen.
 */
export function ScreenPage({ children }) {
  return <div className="flex flex-col lg:min-h-[calc(100vh-7rem)]">{children}</div>
}
