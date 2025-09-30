import DesktopSideNav from "@/components/nav/dashboard/side-nav/desktop-side-nav"
import DesktopTopHeader from "@/components/nav/dashboard/top-nav/desktop-top-header"
import MobileNav from "@/components/nav/dashboard/mobile-nav"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <header className="relative z-10 max-md:hidden">
        <DesktopSideNav />
        <DesktopTopHeader />
      </header>
      <header className="relative z-10 hidden max-md:block">
        <MobileNav />
      </header>

      {/* pt-20 because of the top nav height + 4 bottom margin in tailwind units */}
      {/* pl-76 because of the side nav width + 4 left margin in tailwind units */}
      <main className="pt-20 pl-76">{children}</main>
    </div>
  )
}
