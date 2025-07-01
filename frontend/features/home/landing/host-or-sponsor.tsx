import { Button } from "@/components/ui/button"
import { BoxesIcon, UserCircle } from "lucide-react"
import React from "react"

export default function hostOrSponsor() {
  return (
    <section className="flex flex-col py-20 px-12 rounded-xl bg-primary/10 mt-24 mx-auto max-w-400">
      <div className="grid grid-cols-2 gap-12 items-center">
        <div className="rounded-xl bg-background flex flex-col p-12">
          <div className="flex items-center gap-4 mb-8">
            <UserCircle className="w-12 h-12 text-primary stroke-[1.5px]" />
            <h3 className="text-3xl font-bold">I'm a Host</h3>
          </div>
          <p className="text-lg font-medium mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna.
          </p>
          <Button size="xl">Get started</Button>
        </div>
        <div className="rounded-xl bg-background flex flex-col p-12">
          <div className="flex items-center gap-4 mb-8">
            <BoxesIcon className="w-12 h-12 text-primary stroke-[1.5px]" />
            <h3 className="text-3xl font-bold">I'm a Sponsor</h3>
          </div>
          <p className="text-lg font-medium mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna.
          </p>
          <Button size="xl">Get started</Button>
        </div>
      </div>
    </section>
  )
}
