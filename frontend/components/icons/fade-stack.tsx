import React from "react"

export default function FadeStack({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="75"
      height="83"
      viewBox="0 0 75 83"
      fill="none"
    >
      <ellipse cx="37.5" cy="65.5" rx="37.5" ry="17.5" fill="black" />
      <ellipse cx="37.5" cy="41.5" rx="37.5" ry="17.5" fill="#C2C2C2" />
      <ellipse cx="37.5" cy="17.5" rx="37.5" ry="17.5" fill="#DADADA" />
    </svg>
  )
}
