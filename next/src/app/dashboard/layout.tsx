import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme/theme-provider"
import React from "react"
import Script from "next/script"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="theme-init" strategy="beforeInteractive">
        {`
          (function() {
            const theme = localStorage.getItem('theme') || 'auto';
            const resolvedTheme = theme === 'auto'
              ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
              : theme;
            document.documentElement.classList.add(resolvedTheme);
          })();
        `}
      </Script>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster richColors />
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}
