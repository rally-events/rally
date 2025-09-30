import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import DesktopNavClient from "./desktop-side-nav-client"
import { Button } from "@/components/ui/button"
import { HelpCircleIcon, PlusIcon } from "lucide-react"
import { api } from "@/lib/trpc/server"
import { Suspense } from "react"

export default function DesktopSideNav() {
  return (
    <div className="bg-surface fixed top-0 left-0 z-10 flex h-screen w-72 flex-col border-r">
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
        <Button variant="ghost">Terms of Service</Button>
      </div>
      <Separator className="my-2" />
      <div className="flex items-center justify-center pt-1 pb-3">
        <span className="text-muted-foreground text-xs">@ {new Date().getFullYear()} Rally</span>
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
      {user.supabaseMetadata.organization_type === "host" && (
        <Button size="lg" className="w-full">
          Create Event <PlusIcon className="size-4" />
        </Button>
      )}
      <DesktopNavClient organizationType={user.supabaseMetadata.organization_type} />
    </div>
  )
}

const NaviationLinksSkeleton = () => {
  return <>Loading Links...</>
}
