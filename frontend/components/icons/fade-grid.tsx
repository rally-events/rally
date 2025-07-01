import React from "react"

export default function FadeGrid({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 74 74"
      fill="none"
    >
      <rect x="54" y="54" width="20" height="20" rx="10" fill="#DADADA" />
      <rect y="54" width="20" height="20" rx="10" fill="#DADADA" />
      <rect y="27" width="20" height="20" rx="10" fill="#C2C2C2" />
      <rect width="20" height="20" rx="10" fill="black" />
      <rect x="27" y="54" width="20" height="20" rx="10" fill="#DADADA" />
      <rect x="27" y="27" width="20" height="20" rx="10" fill="#C2C2C2" />
      <rect x="27" width="20" height="20" rx="10" fill="black" />
      <rect x="54" y="27" width="20" height="20" rx="10" fill="#C2C2C2" />
      <rect x="54" width="20" height="20" rx="10" fill="black" />
    </svg>
  )
}
