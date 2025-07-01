import React from "react"

export default function FadeCircles({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 107 85"
      fill="none"
    >
      <circle cx="49" cy="44" r="14" fill="black" />
      <circle opacity="0.2" cx="11" cy="25" r="11" fill="black" />
      <circle opacity="0.2" cx="95" cy="40" r="12" fill="black" />
      <circle opacity="0.08" cx="70" cy="7" r="7" fill="black" />
      <circle opacity="0.08" cx="70" cy="78" r="7" fill="black" />
      <circle opacity="0.08" cx="22" cy="65" r="7" fill="black" />
    </svg>
  )
}
