import React from "react"
import { cn } from "@/lib/utils"
import "./hover-arrow.css"
// ? Make sure that whatever component wraps this has a 'group' class

export default function HoverArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      stroke="currentColor"
      fill="none"
      className={cn("size-4 stroke-1", className)}
    >
      <g fillRule="evenodd">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`arrowPath opacity-0 transition-opacity duration-150`}
          d="M1 5h6"
        ></path>
        <path
          className={`transition-transform duration-150 group-hover/arrow:translate-x-[3.5px]`}
          strokeDasharray={0}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1 2l3 3-3 3"
        ></path>
      </g>
    </svg>
  )
}
