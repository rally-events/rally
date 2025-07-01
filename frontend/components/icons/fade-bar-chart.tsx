export default function FadeBarChart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 102 64"
      fill="none"
    >
      <rect opacity="0.08" y="42" width="34" height="22" rx="2" fill="black" />
      <rect
        opacity="0.2"
        x="34"
        y="28"
        width="34"
        height="36"
        rx="2"
        fill="black"
      />
      <rect x="68" width="34" height="64" rx="2" fill="black" />
    </svg>
  )
}
