import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import DesktopNavClient from "./desktop-nav-client"
import { Button } from "@/components/ui/button"
import { HelpCircleIcon, PlusIcon } from "lucide-react"

export default function DesktopNav() {
  return (
    <>
      <div className="w-72" />
      <div className="w-72 border-r h-screen fixed left-0 top-0 p-2 flex flex-col">
        <Link
          href="/dashboard/overview"
          className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-accent transition-colors duration-75"
        >
          <div className="size-10 rounded bg-primary" />
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
