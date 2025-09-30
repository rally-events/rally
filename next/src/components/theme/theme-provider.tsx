"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "auto"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("auto")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) {
      setThemeState(stored)
    }
  }, [])

  // Resolve the actual theme (light or dark) based on theme setting
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === "auto") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        setResolvedTheme(systemTheme)
      } else {
        setResolvedTheme(theme)
      }
    }

    updateResolvedTheme()

    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = () => {
      if (theme === "auto") {
        updateResolvedTheme()
      }
    }

    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
