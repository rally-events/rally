"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import React, { useState } from "react"

export default function HowItWorks() {
  const [isForSponsors, setIsForSponsors] = useState(true)
  return (
    <div className="bg-primary-background mt-16 -mx-12 w-[calc(100%+96px)] mb-48 px-12">
      <section className="flex flex-col w-full mt-24 mx-auto max-w-400">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-sm text-primary uppercase tracking-[.2em]">
            How it works
          </h2>

          <div className="flex items-center justify-between">
            <h1 className="text-6xl font-bold tracking-tight">
              How we make it work for you
            </h1>
            <div className="flex gap-2">
              <Button
                size="lg"
                variant={isForSponsors ? "secondary" : "default"}
                onClick={() => setIsForSponsors(false)}
              >
                Hosts
              </Button>
              <Button
                size="lg"
                variant={isForSponsors ? "default" : "secondary"}
                onClick={() => setIsForSponsors(true)}
              >
                Sponsors
              </Button>
            </div>
          </div>
          <div className="flex gap-6 mt-16">
            <div className="flex flex-col gap-4 py-16 flex-grow">
              <div className="w-20 h-15 border-2 border-dashed border-primary rounded-xl mb-8" />
              <h3 className="text-3xl font-semibold">Create your profile</h3>
              <p className="font-medium w-86">
                Showcasing your community, events, and audience demographics
              </p>
            </div>

            <div className="flex flex-col gap-4 py-16 flex-grow">
              <div className="w-20 h-15 border-2 border-dashed border-primary rounded-xl mb-8" />
              <h3 className="text-3xl font-semibold">
                Find your perfect match
              </h3>
              <p className="font-medium w-86">
                Showcasing your community, events, and audience demographics
              </p>
            </div>

            <div className="flex flex-col gap-4 py-16 flex-grow">
              <div className="w-20 h-15 border-2 border-dashed border-primary rounded-xl mb-8" />
              <h3 className="text-3xl font-semibold">Manage & measure</h3>
              <p className="font-medium w-86">
                Showcasing your community, events, and audience demographics
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-20 px-8 py-16 rounded-3xl bg-primary items-center translate-y-[50%] -mt-24">
          <h2 className="text-5xl font-bold tracking-tight text-background text-center">
            Start Creating Authentic <br /> Connections Today
          </h2>
          <div className="flex gap-4">
            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: "primary-contrast",
                size: "xxl",
              })}
            >
              I'm a Host
            </Link>
            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: "primary-contrast-outline",
                size: "xxl",
              })}
            >
              I'm a Sponsor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
