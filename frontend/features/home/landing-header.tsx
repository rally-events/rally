import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export default function LandingHeader() {
  return (
    <header className="flex items-center justify-between px-16 py-6">
      <div>
        <h1 className="text-2xl font-bold w-46">Rally</h1>
      </div>
      <div className="flex items-center gap-12 font-semibold">
        <Link href="/">Home</Link>
        <Link href="/">Solutions</Link>
        <Link href="/">Benefits</Link>
        <Link href="/">Process</Link>
      </div>
      <div className="flex items-center gap-2 w-46">
        {/* <Link
          href="/accounts/sign-in"
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
        <Link href="/accounts/sign-in" className={buttonVariants()}>
          Get Started
        </Link> */}
        <Link href="/accounts/waitlist" className={buttonVariants()}>
          Get Started
        </Link>
      </div>
    </header>
  )
}
