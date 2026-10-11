import { Card, Table, cx } from '../ui/index.js'
import { company } from '../../data/mockData.js'
import { STATUS_TONE, TONE_DOT } from '../../lib/tones.js'

/**
 * A printable document — the sale invoice and the transfer note share it.
 *
 * Deep header band with the company and document number (the portal hero's
 * gradient), a facts grid, the lines, the totals block, and a footer line with
 * the company's registered details.
 */
export function InvoiceSheet({ kind, number, status, meta, columns, items, totals, note }) {
  return (
    <Card padding="none" clip className="print:rounded-none print:border-0">
      <div className="flex flex-wrap items-start justify-between gap-6 bg-gradient-to-br from-deep to-brand-900 px-7 py-7 sm:px-9">
        <div className="flex items-center gap-3.5">
          <img src="/CompanyLogo/logo-mark.svg" alt="" className="size-12 rounded-[14px] ring-1 ring-white/25" />
          <div>
            <p className="text-lg font-bold tracking-tight text-on-brand-light">{company.name}</p>
            <p className="mt-0.5 text-[13px] text-deep-muted">
              VAT {company.vatNumber} · CR {company.crNumber}
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="eyebrow text-deep-muted">{kind}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-on-brand-light">{number}</p>
          {/* Badge's washes are tuned for white and vanish on the deep band, so
              the chip is a white wash with the status carried by its dot. */}
          {status && (
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/12 px-2.5 py-0.5 text-[12px] font-medium text-on-brand-light">
              <span className={cx('size-1.75 rounded-full', TONE_DOT[STATUS_TONE[status] ?? 'neutral'])} />
              {status}
            </span>
          )}
        </div>
      </div>

      <dl className="grid gap-x-8 gap-y-5 border-b border-line px-7 py-6 sm:grid-cols-2 sm:px-9 lg:grid-cols-4">
        {meta.map((m) => (
          <div key={m.label} className="min-w-0">
            <dt className="eyebrow text-muted">{m.label}</dt>
            <dd className="mt-1.5 truncate text-[15px] font-semibold text-ink">{m.value}</dd>
            {m.sub && <dd className="mt-0.5 truncate text-[13px] text-muted">{m.sub}</dd>}
          </div>
        ))}
      </dl>

      <Table
        bare
        pad="px-4 first:pl-7 last:pr-7 sm:first:pl-9 sm:last:pr-9"
        columns={columns}
        rows={items}
        rowKey={(row) => row.productId}
      />

      <div className="flex justify-end border-t border-line px-7 py-6 sm:px-9">
        <dl className="w-full max-w-xs">
          {totals.map((t) => (
            <div
              key={t.label}
              className={
                t.strong
                  ? 'mt-2 flex items-baseline justify-between border-t border-line pt-3'
                  : 'flex items-baseline justify-between py-1'
              }
            >
              <dt className={t.strong ? 'text-sm font-semibold text-ink' : 'text-sm text-muted'}>{t.label}</dt>
              <dd className={t.strong ? 'text-[22px] leading-none font-bold text-ink tabular-nums' : 'text-sm font-semibold text-ink tabular-nums'}>
                {t.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {note && (
        <div className="border-t border-line px-7 py-5 sm:px-9">
          <p className="eyebrow text-muted">Note</p>
          <p className="mt-1.5 text-sm text-ink">{note}</p>
        </div>
      )}

      <p className="border-t border-line bg-surface px-7 py-4 text-xs text-muted sm:px-9">
        {company.legalName} · {company.address} · {company.phone} · {company.email}
      </p>
    </Card>
  )
}
