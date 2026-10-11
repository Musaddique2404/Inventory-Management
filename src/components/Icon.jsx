
const ICONS = {
  overview: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="4.5" rx="1.6" />
      <rect x="13.5" y="10.5" width="7.5" height="10.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20.5h16" />
      <rect x="5.5" y="11" width="3" height="6.5" rx="1" />
      <rect x="10.5" y="5.5" width="3" height="12" rx="1" />
      <rect x="15.5" y="8.5" width="3" height="9" rx="1" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9M8 5.3l8 4.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 13.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.5" />
      <path d="M4 13.5h4.2l1.3 2.5h5l1.3-2.5H20" />
      <path d="M12 3.5v8m0 0 3.2-3.2M12 11.5 8.8 8.3" />
    </>
  ),
  truck: (
    <>
      <path d="M14 16V6.5A1.5 1.5 0 0 0 12.5 5h-8A1.5 1.5 0 0 0 3 6.5V16h2" />
      <path d="M14 9h3.6l3.4 3.6V16h-2M9 16h6" />
      <circle cx="7" cy="16.5" r="2" />
      <circle cx="17" cy="16.5" r="2" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2.5" />
      <path d="M9 4.5v-.7a1.3 1.3 0 0 1 1.3-1.3h3.4A1.3 1.3 0 0 1 15 3.8v.7" />
      <path d="M9.5 10.5h5M12 8v5M9.5 16.5h5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.3z" />
      <path d="M9 8h6M9 11.5h6M9 15h3.5" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5 5.5 4h13L20 9.5" />
      <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
      <path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 20V8.5L12 4l9 4.5V20" />
      <path d="M7 20v-8h10v8M7 15h10" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2.3" />
      <circle cx="7.5" cy="17" r="2.3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.6 7.6 0 0 1 15 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 19.5a6.5 6.5 0 0 1 13 0M16 5.2a3.4 3.4 0 0 1 0 6.6M18 14.2a6.4 6.4 0 0 1 3.5 5.3" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V21M15 10h3.5a1.5 1.5 0 0 1 1.5 1.5V21M2.5 21h19" />
      <path d="M8 8h3M8 12h3M8 16h3" />
    </>
  ),
  hash: <path d="M9.5 3.5 7.5 20.5M16.5 3.5l-2 17M4.5 8.5h16M3.5 15.5h16" />,
  mapPin: (
    <>
      <path d="M12 21s-7-6.3-7-11.5a7 7 0 0 1 14 0C19 14.7 12 21 12 21" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.2V5A1.5 1.5 0 0 1 5 3.5h7.2l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.6 6.6a1.5 1.5 0 0 1-2.1 0z" />
      <circle cx="8" cy="8" r="1.4" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 9.5v.1M18 14.5v.1" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19M6.5 15h4" />
    </>
  ),
  bank: <path d="M3.5 9.5 12 4l8.5 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18" />,
  percent: (
    <>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <path d="M8 8v8M11 8v8M13.5 8v8M16 8v8" />
    </>
  ),
  print: (
    <>
      <path d="M7 9V3.5h10V9" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <path d="M7 14h10v6.5H7z" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  logout: (
    <>
      <path d="M9 4.5H6.5a2.5 2.5 0 0 0-2.5 2.5v10a2.5 2.5 0 0 0 2.5 2.5H9" />
      <path d="M15.5 8.5 19 12l-3.5 3.5M19 12H9.5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrowLeft: <path d="M19 12H5m0 0 6-6m-6 6 6 6" />,
  arrowRight: <path d="M5 12h14m0 0-6-6m6 6-6 6" />,
  chevronLeft: <path d="m14.5 5-7 7 7 7" />,
  chevronRight: <path d="m9.5 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.2 2.7 2.7L16 9.5" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  trendUp: (
    <>
      <path d="m4 16 5.5-5.5 3.5 3.5L20 7.5" />
      <path d="M15 7.5h5v5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 4.3 2.8 17.2A2 2 0 0 0 4.5 20.2h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0" />
      <path d="M12 9.5v4M12 16.6v.1" />
    </>
  ),
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7.5 7.1 5a1.6 1.6 0 0 0 1.8 0l7.1-5" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h2.2l1.6 4-2 1.4a11.5 11.5 0 0 0 5.3 5.3l1.4-2 4 1.6v2.2a2.5 2.5 0 0 1-2.7 2.5A15.5 15.5 0 0 1 4 6.2a2.5 2.5 0 0 1 2.5-2.7" />
  ),
  download: <path d="M12 4v11m0 0 4-4m-4 4-4-4M4.5 19.5h15" />,
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6z" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </>
  ),
  trash: (
    <>
      <path d="M4 6.5h16M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" />
      <path d="M6 6.5 6.8 19a2 2 0 0 0 2 1.9h6.4a2 2 0 0 0 2-1.9L18 6.5" />
    </>
  ),
}

export default function Icon({ name, className = 'size-5', strokeWidth = 1.7, ...rest }) {
  const glyph = ICONS[name]
  if (!glyph) return null

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {glyph}
    </svg>
  )
}
