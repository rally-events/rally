import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export default function hero() {
  return (
    <section className="flex flex-col">
      <div className="grid grid-cols-5 gap-12 items-center">
        <div className="flex flex-col gap-4 items-center col-span-3">
          <h2 className="font-bold text-sm text-primary uppercase tracking-[.2em]">
            Welcome to Rally
          </h2>
          <h1 className="xl:text-7xl lg:text-6xl text-5xl font-bold text-center tracking-tight">
            Where brands meet <br /> their community
          </h1>
          <p className="text-center font-semibold text-lg">
            Get your brand in front of the right people, at the right place, at
            the right time
          </p>
          <div className="flex items-center gap-2 mt-8">
            <Link
              href="/accounts/sign-in"
              className={buttonVariants({ size: "xl" })}
            >
              Get started
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: "secondary", size: "xl" })}
            >
              How it works
            </Link>
          </div>
        </div>
        <div className="h-full w-full relative aspect-square col-span-2">
          <div className="absolute inset-0 bg-primary/10 rounded-xl" />
        </div>
      </div>
      <div className="flex flex-col gap-8 items-center mt-24">
        <h4 className="text-xl font-medium text-muted-foreground">
          Trusted by hundreds of brands
        </h4>
        <div className="flex items-center flex-wrap gap-12">
          <div className="h-16 w-48 rounded border-2 border-dashed" />
          <div className="h-16 w-48 rounded border-2 border-dashed" />
          <div className="h-16 w-48 rounded border-2 border-dashed" />
          <div className="h-16 w-48 rounded border-2 border-dashed" />
          <div className="h-16 w-48 rounded border-2 border-dashed" />
          <div className="h-16 w-48 rounded border-2 border-dashed" />
        </div>
      </div>
    </section>
  )
}
