import { useState } from 'react'
import { PageHeader } from '../components/layout/index.js'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  Input,
  List,
  ListRow,
  SectionHeader,
} from '../components/ui/index.js'
import { useToast } from '../context/ToastContext.jsx'
import { branches, company, invoicePrefixes, users } from '../data/mockData.js'

const ROLE_TONE = { Owner: 'brand', 'Warehouse manager': 'warn', 'Shop manager': 'success', Cashier: 'neutral' }

function CompanyForm() {
  const { toast } = useToast()
  const [form, setForm] = useState(company)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const changed = Object.keys(company).some((k) => form[k] !== company[k])

  const save = (e) => {
    e.preventDefault()
    toast('This is a prototype — company details weren’t saved.', 'warn')
  }

  return (
    <Card as="form" padding="lg" onSubmit={save}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Trading name" required>
          {(props) => <Input {...props} icon="building" value={form.name} onChange={set('name')} />}
        </Field>
        <Field label="Legal name" hint="As registered — printed on every invoice.">
          {(props) => <Input {...props} value={form.legalName} onChange={set('legalName')} />}
        </Field>
        <Field label="VAT number" hint="15 digits, from ZATCA.">
          {(props) => <Input {...props} icon="percent" value={form.vatNumber} onChange={set('vatNumber')} />}
        </Field>
        <Field label="CR number">
          {(props) => <Input {...props} icon="hash" value={form.crNumber} onChange={set('crNumber')} />}
        </Field>
        <Field label="Phone">
          {(props) => <Input {...props} icon="phone" type="tel" value={form.phone} onChange={set('phone')} />}
        </Field>
        <Field label="Email">
          {(props) => <Input {...props} icon="mail" type="email" value={form.email} onChange={set('email')} />}
        </Field>
        <Field label="Address" className="sm:col-span-2">
          {(props) => <Input {...props} icon="mapPin" value={form.address} onChange={set('address')} />}
        </Field>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <Button type="submit" icon="check" disabled={!changed}>
          Save changes
        </Button>
        {changed && (
          <Button variant="ghost" onClick={() => setForm(company)}>
            Discard
          </Button>
        )}
      </div>
    </Card>
  )
}

function PrefixForm() {
  const { toast } = useToast()
  const [rows, setRows] = useState(invoicePrefixes)
  const set = (id, key) => (e) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: e.target.value } : r)))

  return (
    <Card
      as="form"
      padding="lg"
      onSubmit={(e) => {
        e.preventDefault()
        toast('This is a prototype — prefixes weren’t saved.', 'warn')
      }}
    >
      <div className="flex flex-col divide-y divide-line-soft">
        {rows.map((r) => (
          <div key={r.id} className="grid items-center gap-3 py-3.5 first:pt-0 sm:grid-cols-[1fr_9rem_7rem_9rem]">
            <p className="text-sm font-semibold text-ink">{r.label}</p>
            <Input aria-label={`${r.label} prefix`} value={r.prefix} onChange={set(r.id, 'prefix')} />
            <Input aria-label={`${r.label} next number`} type="number" min="1" value={r.next} onChange={set(r.id, 'next')} />
            {/* The number the next document will actually carry, so a typo in
                the prefix shows up here rather than on a printed invoice. */}
            <p className="text-sm text-muted sm:text-right">
              Next: <span className="font-semibold text-ink">{r.prefix}{String(r.next).padStart(r.id.startsWith('sale') ? 5 : 4, '0')}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-line pt-5">
        <Button type="submit" icon="check">
          Save prefixes
        </Button>
      </div>
    </Card>
  )
}

export default function Settings() {
  const { toast } = useToast()
  const sample = (what) => () => toast(`Sample only — ${what} isn’t available in this prototype.`, 'warn')

  return (
    <>
      <PageHeader title="Settings" subtitle="Your company, branches, people and document numbering." action={null} />

      {/* One scrolling page, sections stacked — the portal's Profile layout. */}
      <div className="flex flex-col gap-8">
        <section>
          <SectionHeader title="Company info" className="mb-3" />
          <CompanyForm />
        </section>

        <section>
          <SectionHeader
            title="Branches"
            count={branches.length}
            className="mb-3"
            action={
              <Button variant="outline" size="sm" icon="plus" onClick={sample('adding a branch')}>
                Add branch
              </Button>
            }
          />
          <List>
            {branches.map((b) => (
              <ListRow
                key={b.id}
                icon={b.type === 'warehouse' ? 'warehouse' : 'store'}
                tone={b.type === 'warehouse' ? 'brand' : 'neutral'}
                title={b.name}
                subtitle={`${b.address} · ${b.manager} · ${b.phone}`}
                trailing={
                  <Badge tone={b.type === 'warehouse' ? 'brand' : 'neutral'} size="sm">
                    {b.type === 'warehouse' ? 'Warehouse' : 'Shop'}
                  </Badge>
                }
              />
            ))}
          </List>
        </section>

        <section>
          <SectionHeader
            title="Users & roles"
            count={users.length}
            className="mb-3"
            action={
              <Button variant="outline" size="sm" icon="plus" onClick={sample('inviting a user')}>
                Invite user
              </Button>
            }
          />
          <ul className="overflow-hidden rounded-2xl border border-line bg-panel">
            {users.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line-soft px-5 py-3.5 last:border-0">
                <Avatar initials={u.initials} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-ink">{u.name}</p>
                  <p className="mt-0.5 truncate text-[13px] text-muted">
                    {u.email} · {u.branch}
                  </p>
                </div>
                <Badge dot tone={ROLE_TONE[u.role]} size="sm">
                  {u.role}
                </Badge>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeader title="Invoice prefixes" className="mb-3" />
          <PrefixForm />
        </section>
      </div>
    </>
  )
}
