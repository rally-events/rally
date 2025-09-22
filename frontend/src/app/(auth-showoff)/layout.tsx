import ShowoffNav from "@/components/auth/showoff-nav"
import Link from "next/link"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full items-stretch">
      <div className="mx-auto flex w-full max-w-2xl flex-shrink-0 flex-col justify-between px-20 py-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-medium">
            Rally
          </Link>
          <ShowoffNav />
        </header>
        {children}
        <footer className="">
          <Link href="/">Support</Link>
        </footer>
      </div>
      <div className="relative col-span-2 flex-grow">
        <div className="absolute inset-8 left-0 rounded-2xl bg-purple-300" />
      </div>
    </div>
  )
}
