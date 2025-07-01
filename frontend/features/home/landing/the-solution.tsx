import { buttonVariants } from "@/components/ui/button"
import { BadgeCheckIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function TheSolution() {
  return (
    <section className="flex flex-col mt-48 w-full mx-auto max-w-400">
      <div className="flex flex-col gap-4 items-center">
        <h2 className="font-bold text-sm text-primary text-center uppercase tracking-[.2em] mb-4">
          The Problem
        </h2>
        <h1 className="text-6xl font-bold text-center tracking-tight">
          Reaching People in their <br /> Third Spaces
        </h1>
        <p className="text-lg font-medium text-center w-260">
          Digital ads are being ignored. Ad blockers are rising. Attention spans
          are shrinking. As consumers increasingly tune out traditional digital
          advertising, brands need a new approach to connect with their
          audience.
        </p>
        <div className="grid grid-cols-3 gap-6 mt-16">
          <div className="relative aspect-[7/8] w-full">
            <Image
              src="/image2.png"
              alt="The Solution 1"
              fill
              className="object-cover object-center rounded-xl"
            />
          </div>
          <div className="relative aspect-[7/8] rounded-xl shadow p-8 flex flex-col gap-4 items-center justify-center">
            <BadgeCheckIcon className="w-14 h-14 text-primary" />
            <h3 className="text-3xl font-semibold text-center text-primary">
              The Trust Factor
            </h3>
            <p className="font-medium text-center">
              The Trust Factor: According to Nielsen research, 91% of consumers
              trust recommendations from people they know over any form of
              advertising.
            </p>
          </div>
          <div className="relative aspect-[7/8] w-full">
            <Image
              src="/image2.png"
              alt="The Solution 1"
              fill
              className="object-cover object-center rounded-xl"
            />
          </div>
        </div>
        <Link href="/" className={`mt-6 ${buttonVariants({ size: "xl" })}`}>
          Get Started
        </Link>
      </div>
    </section>
  )
}
