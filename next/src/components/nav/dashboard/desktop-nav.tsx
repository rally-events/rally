import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import DesktopNavClient from "./desktop-nav-client"
import { Button } from "@/components/ui/button"
import { HelpCircleIcon, PlusIcon } from "lucide-react"

export default function DesktopNav() {
  return (
    <>
      <div className="w-72" />
      <div className="fixed top-0 left-0 flex h-screen w-72 flex-col border-r p-2">
        <Link
          href="/dashboard/overview"
          className="hover:bg-accent flex items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-75"
        >
          <div className="bg-primary size-10 rounded" />
          <h2 className="text-2xl font-semibold">Rally</h2>
        </Link>
        <Separator className="my-2" />
        <Button size="lg" className="w-full">
          Create Event <PlusIcon className="size-4" />
        </Button>
        <Separator className="my-2" />
        <DesktopNavClient />
        <div className="mt-auto flex flex-col gap-2">
          <Button>
            Help & Support <HelpCircleIcon className="size-4" />
          </Button>
          <Button variant="ghost">Terms of Service</Button>
        </div>
      </div>
    </>
  )
}
