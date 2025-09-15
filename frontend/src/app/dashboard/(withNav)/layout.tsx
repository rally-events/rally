import DesktopNav from "@/components/nav/dashboard/desktop-nav"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <header className="max-md:hidden">
        <DesktopNav />
      </header>
      <header className="max-md:block">{/* <MobileNav /> */}</header>

      <main>{children}</main>
    </div>
  )
}
