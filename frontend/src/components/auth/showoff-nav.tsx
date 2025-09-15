"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ShowoffNav() {
  const pathname = usePathname()

  if (pathname.startsWith("/sign-in")) {
    return (
      <span className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="text-foreground underline hover:text-primary"
        >
          Sign up
        </Link>
      </span>
    )
  }

  if (pathname.startsWith("/sign-up")) {
    return (
      <span className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-foreground underline hover:text-primary"
        >
          Sign in
        </Link>
      </span>
    )
  }
}
