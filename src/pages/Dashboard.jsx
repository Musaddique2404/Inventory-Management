import { PageHeader } from '../components/layout/index.js'
import {
  BranchStock,
  KeyFigures,
  RecentActivity,
  SalesHero,
  StockAlerts,
} from '../components/dashboard/index.js'
import { TODAY, admin } from '../data/mockData.js'
import { formatLong } from '../lib/format.js'

export default function Dashboard() {
  /* Reads the real clock: it greets the person for the time they actually
     opened the app, and is never measured against a mocked document time. */
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <PageHeader title={`${greeting}, ${admin.name.split(' ')[0]}`} subtitle={formatLong(TODAY)} />

      <div className="flex flex-col gap-6">
        <SalesHero />
        <KeyFigures />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,40rem)_minmax(18rem,1fr)]">
          <BranchStock />
          <StockAlerts />
        </div>
        <RecentActivity />
      </div>
    </>
  )
}
