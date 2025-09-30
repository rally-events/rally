import { Toaster } from "@/components/ui/sonner"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <Toaster />
        {children}
      </ThemeProvider>
    </>
  )
}
