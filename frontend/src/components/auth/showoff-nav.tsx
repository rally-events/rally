"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ShowoffNav() {
  const pathname = usePathname()

  if (pathname.startsWith("/sign-in")) {
    return (
      <span className="text-muted-foreground text-sm">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-foreground hover:text-primary underline">
          Sign up
        </Link>
      </span>
    )
  }

  if (pathname.startsWith("/sign-up")) {
    return (
      <span className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-foreground hover:text-primary underline">
          Sign in
        </Link>
      </span>
    )
  }
}
