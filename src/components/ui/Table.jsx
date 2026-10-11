import { Fragment } from 'react'
import { cx } from '../../lib/cx.js'

/**
 * A data table in the card chrome List uses — hairline frame, 2xl radius,
 * eyebrow column heads in --muted (they *name* data, so never --faint).
 *
 * `columns` is [{ key, label, align, render, className }]; `render(row)` wins
 * over `row[key]`. Right-aligned columns get tabular figures so amounts line up
 * down the page.
 *
 * With `onRowClick` each row becomes the link to its record: pointer, hover
 * fill, and Enter/Space from the keyboard. Below `sm` the rows render as
 * stacked cards instead (see the phone layout below).
 *
 * `bare` drops the frame, for a table that sits inside another card (the
 * invoice sheet) and would otherwise draw a box inside a box. `pad` replaces
 * the cells' horizontal padding — the sheet lines its first and last column
 * up with its own px-7/px-9 gutter.
 *
 * `fill` (inside a ScreenPage) stretches the table to the bottom of the screen
 * from lg up: the rows scroll inside it under a header row that stays put.
 */
export function Table({ columns, rows, rowKey = (row) => row.id, onRowClick, footer, bare = false, pad = 'px-5', fill = false, className }) {
  const cell = (col, row) => (col.render ? col.render(row) : row[col.key])
  const rowLink = (row) =>
    onRowClick && {
      tabIndex: 0,
      onClick: () => onRowClick(row),
      onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onRowClick(row)
        }
      },
    }
  const linkClass = onRowClick && 'cursor-pointer hover:bg-surface focus-visible:bg-tint focus-visible:outline-none'

  /* The phone layout's anatomy, read off the column list: a "#" column joins
     the title, unlabelled columns (a row's remove button) sit at its end, the
     first remaining column is the title and the rest become label / value
     pairs. */
  const rank = columns.filter((c) => c.label === '#')
  const tail = columns.filter((c) => c.label === '')
  const [head, ...pairs] = columns.filter((c) => c.label !== '#' && c.label !== '')

  return (
    <div
      className={cx(
        !bare && 'overflow-hidden rounded-2xl border border-line bg-panel',
        // basis-0 so the rows add nothing to the page's height: the table takes
        // whatever the screen has left, never less than 16rem.
        fill && 'lg:flex lg:min-h-64 lg:flex-1 lg:basis-0 lg:flex-col',
        className,
      )}
    >
      {/* Phones: stacked rows, after MeetNPlan's compact list rows — a wide
          table scrolled sideways on a 390px screen hides most of every row. */}
      <ul className="divide-y divide-line-soft sm:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} {...rowLink(row)} className={cx(bare ? 'px-7 py-3.5' : 'px-4 py-3.5', 'transition', linkClass)}>
            <div className="flex items-center gap-3">
              {rank.map((col) => (
                <span key={col.key} className="text-sm tabular-nums">
                  {cell(col, row)}
                </span>
              ))}
              <div className="min-w-0 flex-1 text-sm text-ink">{cell(head, row)}</div>
              {tail.map((col) => (
                <Fragment key={col.key}>{cell(col, row)}</Fragment>
              ))}
            </div>
            {pairs.length > 0 && (
              <dl className="mt-2.5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2">
                {pairs.map((col) => (
                  <Fragment key={col.key}>
                    <dt className="eyebrow text-muted">{col.label}</dt>
                    <dd className="flex justify-end text-right text-sm text-ink tabular-nums">{cell(col, row)}</dd>
                  </Fragment>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
      {footer && (
        <table className="w-full border-collapse border-t border-line bg-surface sm:hidden">
          <tfoot>{footer}</tfoot>
        </table>
      )}

      <div className={cx('scrollbar-slim hidden overflow-x-auto sm:block', fill && 'lg:min-h-0 lg:flex-1 lg:overflow-y-auto')}>
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cx(
                    'eyebrow py-3 whitespace-nowrap text-muted',
                    pad,
                    // Sticky cells carry their own fill and rule: a collapsed row
                    // border would scroll away under them.
                    fill && 'lg:sticky lg:top-0 lg:z-10 lg:bg-surface lg:shadow-[inset_0_-1px_0_var(--line)]',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                {...rowLink(row)}
                className={cx('border-b border-line-soft transition last:border-0', linkClass)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cx(
                      'py-3.5 text-sm whitespace-nowrap text-ink',
                      pad,
                      col.align === 'right' && 'text-right tabular-nums',
                      col.align === 'center' && 'text-center',
                      col.className,
                    )}
                  >
                    {cell(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {footer && <tfoot className="border-t border-line bg-surface">{footer}</tfoot>}
        </table>
      </div>
    </div>
  )
}
