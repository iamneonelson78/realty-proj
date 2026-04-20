export function Logo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Rental CRM logo"
    >
      {/* House body */}
      <path
        d="M20 6L4 18H8V34H18V24H22V34H32V18H36L20 6Z"
        fill="currentColor"
        className="text-brand-600 dark:text-brand-400"
      />
      {/* Flow arrow — forward-right motion */}
      <path
        d="M24 21L29 26L24 31"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 26H29"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
