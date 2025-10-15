import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import DesktopNavClient, { HostCreateEvent } from "./desktop-side-nav-client"
import { Button } from "@/components/ui/button"
import { HelpCircleIcon, PlusIcon } from "lucide-react"
import { api } from "@/lib/trpc/server"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import NAV_CONFIG from "@/components/nav/nav-config"

export default function DesktopSideNav() {
  return (
    <div
      className={`${NAV_CONFIG.left.width} bg-surface fixed top-0 left-0 z-10 flex h-screen flex-col border-r`}
    >
      <Link
        href="/"
        className="hover:bg-accent mx-2 mt-2 -mb-0.25 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-75"
      >
        <div className="bg-primary size-8 rounded" />
        <h2 className="text-2xl font-semibold">Rally</h2>
      </Link>
      <Separator className="my-2" />
      <Suspense fallback={<NaviationLinksSkeleton />}>
        <NavigationLinks />
      </Suspense>
      <div className="mt-auto flex flex-col gap-2 px-2">
        <Button variant="outline">
          Help & Support <HelpCircleIcon className="size-4" />
        </Button>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col items-center justify-center gap-1 pt-1 pb-3">
        <span className="text-muted-foreground text-xs">@ {new Date().getFullYear()} Rally</span>
        <div className="flex gap-2">
          <Link href="/" className="hover:text-primary text-muted-foreground text-xs underline">
            Terms of Service
          </Link>
          <Link href="/" className="hover:text-primary text-muted-foreground text-xs underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}

const NavigationLinks = async () => {
  const caller = await api()
  const user = await caller.user.getUserInfo()
  if (!user) {
    return <NaviationLinksSkeleton />
  }
  if (!user.supabaseMetadata.organization_type) {
    return <NaviationLinksSkeleton />
  }

  return (
    <div className="flex flex-col gap-2 px-2">
      {user.supabaseMetadata.organization_type === "host" && <HostCreateEvent />}
      <DesktopNavClient organizationType={user.supabaseMetadata.organization_type} />
    </div>
  )
}

const NaviationLinksSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 px-2">
      <Skeleton className="h-9.5 w-full" />
      <Skeleton className="h-9.5 w-full" />
      <Skeleton className="h-9.5 w-full" />
      <Skeleton className="h-9.5 w-full" />
      <Skeleton className="h-9.5 w-full" />
      <Skeleton className="h-9.5 w-full" />
      <Separator />
      <Skeleton className="h-9.5 w-full" />
      <Skeleton className="h-9.5 w-full" />
    </div>
  )
}
