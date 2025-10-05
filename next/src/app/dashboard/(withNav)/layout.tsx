import DesktopSideNav from "@/components/nav/dashboard/side-nav/left/desktop-side-nav"
import DesktopTopHeader from "@/components/nav/dashboard/top-nav/desktop-top-nav"
import MobileNav from "@/components/nav/dashboard/mobile-nav"
import React, { Suspense } from "react"
import DesktopRightSideContextMenu, {
  DesktopRightSideContextMenuSkeleton,
} from "@/components/nav/dashboard/side-nav/right/desktop-right-side-context-menu"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <header className="relative z-10 flex-shrink-0 max-md:hidden">
        <DesktopSideNav />
        <DesktopTopHeader />
      </header>
      <header className="relative z-10 hidden flex-shrink-0 max-md:block">
        <MobileNav />
      </header>

      {/* pt-20 because of the top nav height + 4 bottom margin in tailwind units */}
      {/* pl-76 because of the side nav width + 4 left margin in tailwind units */}
      <main className="flex-grow pt-20 pb-16 pl-76">{children}</main>
      <header className="relative z-10 flex-shrink-0 px-4 pt-20 max-md:hidden">
        <Suspense fallback={<DesktopRightSideContextMenuSkeleton />}>
          <DesktopRightSideContextMenu />
        </Suspense>
      </header>
    </div>
  )
}
