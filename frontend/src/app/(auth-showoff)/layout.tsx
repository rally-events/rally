import ShowoffNav from "@/components/auth/showoff-nav"
import Link from "next/link"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch h-screen w-full">
      <div className="flex flex-col flex-shrink-0 max-w-2xl justify-between py-12 px-20 mx-auto w-full">
        <header className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-medium">
            Rally
          </Link>
          <ShowoffNav />
        </header>
        <main className="-mt-12">{children}</main>
        <footer className="">
          <Link href="/">Support</Link>
        </footer>
      </div>
      <div className="relative col-span-2 flex-grow">
        <div className="absolute left-0 inset-8 rounded-2xl bg-purple-300" />
      </div>
    </div>
  )
}
