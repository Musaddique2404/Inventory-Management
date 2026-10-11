import { Children, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../Icon.jsx'
import { cx } from '../../lib/cx.js'
import { useDismiss } from '../../hooks/useDismiss.js'

/* Fields are recessed against the white panel, so they take --surface rather
   than a border-only treatment: on a Card the box has to read as "you can type
   here" before it is focused. --canvas is step 50 and sits *above* --surface in
   the background order (see index.css), which is why the field fill is the grey
   and not the tint — a tinted field on a tinted canvas reads as raised. */
const CONTROL = cx(
  'w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-ink transition',
  'placeholder:text-faint',
  'focus:border-brand-500 focus:bg-panel focus:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-60',
)

const OK = 'border-line'
/* The error border is the full-strength danger, not the /35 used by soft-filled
   chips: this is a control boundary, and WCAG 1.4.11 asks 3:1 of it. */
const BAD = 'border-danger'

/**
 * Label + control + hint/error, wired together.
 *
 * The id is generated here and handed to the child through a render prop, so a
 * call site cannot forget to link the label to its control — the usual failure
 * that makes a form unusable with a screen reader. `error` replaces `hint`
 * rather than stacking, and is announced via aria-describedby either way.
 *
 * `action` sits at the far end of the label row — the login form's "Forgot
 * password?" — without becoming part of the label's accessible name.
 */
export function Field({ label, hint, error, required, action, children, className }) {
  const id = useId()
  const describedBy = error || hint ? `${id}-desc` : undefined

  const heading = (
    <label htmlFor={id} className="text-[13px] font-semibold text-ink">
      {label}
      {required && <span className="ml-0.5 text-danger">*</span>}
    </label>
  )

  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      {action ? (
        <div className="flex items-center justify-between">
          {heading}
          {action}
        </div>
      ) : (
        heading
      )}

      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}

      {(error || hint) && (
        <p id={describedBy} className={cx('text-xs', error ? 'text-danger' : 'text-muted')}>
          {error || hint}
        </p>
      )}
    </div>
  )
}

/**
 * The text control. `icon` draws a glyph inside the box's left padding (the
 * sign-in form's mail and shield), pushing the text right of it; `trailing`
 * is a node laid over the right edge — the show/hide toggle. Either one wraps
 * the input in a positioning div; with neither, the input renders bare.
 */
export function Input({ icon, trailing, error, className, ...rest }) {
  const control = (
    <input className={cx(CONTROL, error ? BAD : OK, icon && 'pl-10', className)} {...rest} />
  )

  if (!icon && !trailing) return control

  return (
    <div className="relative">
      {icon && (
        <Icon
          name={icon}
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint"
        />
      )}
      {control}
      {trailing}
    </div>
  )
}

/** The multi-line control. `rows` sets the resting height; the user can drag it taller. */
export function Textarea({ error, rows = 4, className, ...rest }) {
  return <textarea rows={rows} className={cx(CONTROL, error ? BAD : OK, 'resize-y', className)} {...rest} />
}

/* Menu geometry, after the MeetNPlan dropdown: 6px off the trigger, kept 8px
   inside the viewport, flipped above when there is less than MIN_BELOW of room
   below and more above. */
const GAP = 6
const EDGE = 8
const MIN_BELOW = 220

function place(trigger) {
  const r = trigger.getBoundingClientRect()
  const left = Math.max(EDGE, Math.min(r.left, window.innerWidth - r.width - EDGE))
  const below = window.innerHeight - r.bottom - EDGE
  const above = r.top - EDGE
  const up = below < MIN_BELOW && above > below
  const maxHeight = Math.min(300, Math.max(96, (up ? above : below) - GAP))
  return up
    ? { left, width: r.width, maxHeight, bottom: window.innerHeight - r.top + GAP }
    : { left, width: r.width, maxHeight, top: r.bottom + GAP }
}

/**
 * The dropdown: a trigger button and a listbox panel, after the MeetNPlan
 * Select. Call sites write it like a native <select> — `<option>` children,
 * `value`, and an `onChange` that reads `e.target.value` — so swapping the
 * native control for this one touched no page.
 *
 * The panel is portalled to <body> with fixed positioning: rendered in place,
 * the Modal's scrolling panel would clip it. Focus stays on the trigger while
 * the panel is open (rows swallow mousedown), so every key lands in onKeyDown
 * and aria-activedescendant names the highlighted row.
 */
export function Select({ error, className, children, value, onChange, disabled, ...rest }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const [active, setActive] = useState(-1)
  const triggerRef = useRef(null)
  const rowsRef = useRef([])
  const baseId = useId()

  const options = Children.toArray(children)
    .filter((child) => child.type === 'option')
    .map((child) => ({
      value: String(child.props.value ?? child.props.children),
      label: child.props.children,
      disabled: !!child.props.disabled,
    }))
  const selectedIdx = options.findIndex((o) => o.value === String(value))
  const selected = options[selectedIdx]

  const close = () => setOpen(false)
  const menuRef = useDismiss(open, close, triggerRef)

  const show = () => {
    setPos(place(triggerRef.current))
    setActive(Math.max(selectedIdx, 0))
    setOpen(true)
  }

  const pick = (opt) => {
    if (opt.disabled) return
    if (opt.value !== String(value)) onChange?.({ target: { value: opt.value } })
    close()
    triggerRef.current?.focus()
  }

  // The panel is fixed to the viewport, so it follows the trigger on scroll —
  // capture phase, to catch scrolling inside a modal as well as the page.
  useEffect(() => {
    if (!open) return
    const follow = () => triggerRef.current && setPos(place(triggerRef.current))
    window.addEventListener('scroll', follow, true)
    window.addEventListener('resize', follow)
    return () => {
      window.removeEventListener('scroll', follow, true)
      window.removeEventListener('resize', follow)
    }
  }, [open])

  useEffect(() => {
    if (open) rowsRef.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const step = (from, dir) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (!options[i].disabled) return i
    return from
  }

  const onKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        show()
      }
      return
    }
    switch (e.key) {
      case 'Escape':
        // Stopped here so a Select inside a Modal closes itself, not the dialog.
        e.preventDefault()
        e.stopPropagation()
        close()
        break
      case 'Tab':
        close()
        break
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => step(i, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => step(i, -1))
        break
      case 'Home':
        e.preventDefault()
        setActive(step(-1, 1))
        break
      case 'End':
        e.preventDefault()
        setActive(step(options.length, -1))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (options[active]) pick(options[active])
        break
    }
  }

  const { maxHeight, ...at } = pos ?? {}

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${baseId}-list` : undefined}
        aria-activedescendant={open && active >= 0 ? `${baseId}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={onKeyDown}
        className={cx(
          CONTROL,
          'flex cursor-pointer items-center justify-between gap-2 text-left',
          open ? 'border-brand-500 bg-panel ring-2 ring-brand-500/15' : error ? BAD : OK,
          className,
        )}
        {...rest}
      >
        <span className={cx('min-w-0 truncate', !selected && 'text-faint')}>
          {selected ? selected.label : 'Select'}
        </span>
        <Icon
          name="chevronDown"
          className={cx(
            'size-4 shrink-0 transition-transform duration-200',
            open ? 'rotate-180 text-brand-500' : 'text-muted',
          )}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            onMouseDown={(e) => e.preventDefault()}
            style={{ position: 'fixed', ...at }}
            className="z-[60] overflow-hidden rounded-xl border border-line bg-panel p-1 shadow-[0_20px_56px_-8px_rgba(28,31,64,0.2),0_4px_16px_rgba(28,31,64,0.06)]"
          >
            <ul
              id={`${baseId}-list`}
              role="listbox"
              aria-label={rest['aria-label']}
              aria-labelledby={rest['aria-label'] ? undefined : rest.id}
              style={{ maxHeight }}
              className="scrollbar-slim flex flex-col gap-0.5 overflow-y-auto"
            >
              {options.map((opt, i) => {
                const isSel = i === selectedIdx
                return (
                  <li
                    key={opt.value}
                    id={`${baseId}-${i}`}
                    ref={(el) => {
                      rowsRef.current[i] = el
                    }}
                    role="option"
                    aria-selected={isSel}
                    aria-disabled={opt.disabled || undefined}
                    onMouseEnter={() => !opt.disabled && setActive(i)}
                    onClick={() => pick(opt)}
                    className={cx(
                      'flex items-center justify-between gap-2 rounded-lg px-2.5 py-2.5 text-sm font-semibold transition-colors',
                      opt.disabled
                        ? 'cursor-not-allowed text-faint'
                        : isSel
                          ? 'cursor-pointer bg-brand-700 text-white'
                          : i === active
                            ? 'cursor-pointer bg-brand-50 text-brand-800'
                            : 'cursor-pointer text-ink',
                    )}
                  >
                    <span className="min-w-0 break-words">{opt.label}</span>
                    {isSel && <Icon name="check" className="size-4 shrink-0" strokeWidth={2.2} />}
                  </li>
                )
              })}
            </ul>
          </div>,
          document.body,
        )}
    </>
  )
}
