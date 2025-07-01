import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import React from "react"

export default function LandingFooter() {
  return (
    <footer className="max-w-400 mx-auto w-full mt-32 px-12">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold tracking-tight">
            Rally is still in the works...
          </h2>
          <p className="text-medium">Stay updated on our launch?</p>
          <div className="flex items-center gap-2 mt-8">
            <Input placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
        </div>
        <nav className="flex justify-between gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-[.2em]">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/">Solutions</Link>
              </li>
              <li>
                <Link href="/">Benefits</Link>
              </li>
              <li>
                <Link href="/">Process</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-[.2em]">
              Legal
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/">Terms of Service</Link>
              </li>
              <li>
                <Link href="/">All Rights Reserved</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-[.2em]">
              Socials
            </h3>
            <ul className="flex gap-4">
              <Link href="/">
                <li className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-background font-black">
                  1
                </li>
              </Link>
              <Link href="/">
                <li className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-background font-black">
                  2
                </li>
              </Link>
              <Link href="/">
                <li className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-background font-black">
                  3
                </li>
              </Link>
              <Link href="/">
                <li className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-background font-black">
                  4
                </li>
              </Link>
              <Link href="/">
                <li className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-background font-black">
                  5
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </div>
      <div className="flex justify-center pt-16 pb-2 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Rally. All rights reserved.</p>
      </div>
    </footer>
  )
}
