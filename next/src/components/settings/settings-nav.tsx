"use client"

import { usePathname, useRouter } from "next/navigation"
import NAV_CONFIG from "../nav/nav-config"
import Link from "next/link"
import { ComponentType, SVGProps } from "react"
import { CreditCardIcon, LockIcon, UserIcon } from "lucide-react"

export default function SettingsNav() {
  const router = useRouter()
  const pathname = usePathname()

  const settingsSegment = pathname.split("/").slice(3)[0]
  if (!settingsSegment) {
    router.push("/dashboard/settings/account")
    return null
  }

  return (
    <div className="fixed top-0 left-0 flex h-full flex-col">
      <div className={`${NAV_CONFIG.top.height} flex-shrink-0`} />
      <div className={`flex flex-grow`}>
        <div className={`${NAV_CONFIG.left.width} flex-shrink-0`} />
        <div className={`${NAV_CONFIG.settings.width} bg-surface flex flex-col gap-1 border-r p-2`}>
          <SettingsNavItem
            href="/dashboard/settings/account"
            Icon={UserIcon}
            label="Account & Security"
            isActive={settingsSegment === "account"}
          />
          <SettingsNavItem
            href="/dashboard/settings/billing"
            Icon={CreditCardIcon}
            label="Billing"
            isActive={settingsSegment === "billing"}
          />
        </div>
      </div>
    </div>
  )
}

interface SettingsNavItemProps {
  href: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  isActive: boolean
}

const SettingsNavItem = ({ href, Icon, label, isActive }: SettingsNavItemProps) => {
  return (
    <Link
      href={href}
      className={`${isActive ? "border-border bg-accent text-foreground cursor-default font-medium tracking-[-0.0125em]" : "hover:bg-accent hover:text-foreground text-foreground/80 border-transparent"} flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 transition-all duration-75`}
    >
      <Icon className="size-4" />
      <h2 className="text-sm">{label}</h2>
    </Link>
  )
}
