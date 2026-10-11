import splashVideo from '../../assets/SplashVideo/Riyadh.mp4'
import { company } from '../../data/mockData.js'

/**
 * The full-bleed splash behind the sign-in card: the city loop, a gradient
 * that keeps the left column legible over it, the brand column, and the
 * right-hand column for whatever the page puts there (`children`).
 *
 * The video is decorative and hidden from assistive tech.
 */
export function SplashPanel({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-950">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={splashVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-950/55 to-brand-950/35 lg:to-brand-950/10" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="hidden min-w-0 flex-1 flex-col justify-between p-14 lg:flex">
          <div className="flex items-center gap-4">
            <img src="/CompanyLogo/logo-mark.svg" alt="" className="size-16 rounded-[18px] ring-1 ring-white/25" />
            <span className="font-display text-3xl font-extrabold tracking-tight text-white">{company.name}</span>
          </div>
          <div>
            <h1 className="font-display text-3xl leading-tight font-bold text-balance text-white xl:text-4xl">
              Every unit, every shop, one place.
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/70">
              Receive stock into the warehouse, send it out to your shops, and ring up sales —
              with stock levels that follow every move.
            </p>
          </div>
          <p className="text-sm text-white/50">© 2026 {company.legalName}</p>
        </div>

        {/* Sign-in column. */}
        <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-8 lg:w-[560px] lg:flex-none lg:justify-end lg:p-12">
          {children}
        </div>
      </div>
    </div>
  )
}
