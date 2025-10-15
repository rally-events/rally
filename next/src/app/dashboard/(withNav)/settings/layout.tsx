import NAV_CONFIG from "@/components/nav/nav-config"
import SettingsNav from "@/components/settings/settings-nav"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SettingsNav />
      <div className={`${NAV_CONFIG.settings.padding} pr-36`}>
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </>
  )
}
