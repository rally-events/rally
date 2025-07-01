"use client"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChartBarIcon,
  CoinsIcon,
  FlagIcon,
  HandshakeIcon,
} from "lucide-react"
import React, { useState } from "react"
import Image from "next/image"

export default function ForHostOrSponsor() {
  const [isForSponsors, setIsForSponsors] = useState(false)

  return (
    <div className="relative mt-24">
      <section className="max-w-400 mx-auto w-full mt-16 flex relative z-10">
        <div
          className={`${isForSponsors ? "" : "absolute"} flex flex-col group gap-4 mt-8 h-148`}
          data-active={isForSponsors ? "true" : "false"}
        >
          <h2 className="font-bold group-data-[active=true]:opacity-100 opacity-0 translate-y-4 group-data-[active=true]:delay-250 group-data-[active=true]:translate-y-0 text-sm text-background uppercase tracking-[.2em] mb-4 transition-all duration-300">
            For Sponsors
          </h2>
          <h1 className="text-6xl font-bold tracking-tight text-background mb-8 group-data-[active=true]:opacity-100 opacity-0 translate-y-4 group-data-[active=true]:delay-300 group-data-[active=true]:translate-y-0 transition-all duration-300">
            Event Sponsors & <br /> Brand Leaders
          </h1>
          <h3 className="text-2xl font-medium text-background mb-4 group-data-[active=true]:opacity-100 opacity-0 translate-y-4 group-data-[active=true]:delay-350 group-data-[active=true]:translate-y-0 transition-all duration-300">
            Benefits
          </h3>
          <div className="flex flex-col gap-4">
            <BenefitItem
              className="group-data-[active=true]:delay-400"
              description="Access to brand sponsorships without complicated negotiations"
              icon={<HandshakeIcon className="w-7 h-7 text-background" />}
            />
            <BenefitItem
              className="group-data-[active=true]:delay-450"
              description="New revenue streams for your events/organization"
              icon={<CoinsIcon className="w-7 h-7 text-background" />}
            />
            <BenefitItem
              className="group-data-[active=true]:delay-500"
              description="Tools to showcase your community's value"
              icon={<ChartBarIcon className="w-7 h-7 text-background" />}
            />
            <BenefitItem
              className="group-data-[active=true]:delay-550"
              description="Simple process to manage sponsor relationships"
              icon={<FlagIcon className="w-7 h-7 text-background" />}
            />
          </div>
        </div>
        <div
          data-active={!isForSponsors ? "true" : "false"}
          className={`${isForSponsors ? "absolute" : ""} group flex flex-col gap-4 mt-8 h-148`}
        >
          <h2 className="font-bold group-data-[active=true]:opacity-100 opacity-0 translate-y-4 group-data-[active=true]:delay-250 group-data-[active=true]:translate-y-0 text-sm text-background uppercase tracking-[.2em] mb-4 transition-all duration-300">
            For Hosts
          </h2>
          <h1 className="text-6xl font-bold tracking-tight text-background mb-8 group-data-[active=true]:opacity-100 opacity-0 translate-y-4 group-data-[active=true]:delay-300 group-data-[active=true]:translate-y-0 transition-all duration-300">
            Event Organizers & <br /> Community Leaders
          </h1>
          <h3 className="text-2xl font-medium text-background mb-4 group-data-[active=true]:opacity-100 opacity-0 translate-y-4 group-data-[active=true]:delay-350 group-data-[active=true]:translate-y-0 transition-all duration-300">
            Benefits
          </h3>
          <div className="flex flex-col gap-4">
            <BenefitItem
              className="group-data-[active=true]:delay-400"
              description="Access to brand sponsorships without complicated negotiations"
              icon={<HandshakeIcon className="w-7 h-7 text-background" />}
            />
            <BenefitItem
              className="group-data-[active=true]:delay-450"
              description="New revenue streams for your events/organization"
              icon={<CoinsIcon className="w-7 h-7 text-background" />}
            />
            <BenefitItem
              className="group-data-[active=true]:delay-500"
              description="Tools to showcase your community's value"
              icon={<ChartBarIcon className="w-7 h-7 text-background" />}
            />
            <BenefitItem
              className="group-data-[active=true]:delay-550"
              description="Simple process to manage sponsor relationships"
              icon={<FlagIcon className="w-7 h-7 text-background" />}
            />
          </div>
        </div>
        <div className="relative aspect-[9/16] h-164 rounded-xl overflow-hidden ml-auto">
          <Image
            src="/image.png"
            alt="For Host or Sponsor"
            fill
            className="object-cover"
          />
        </div>
      </section>
      <div className="-mx-12 w-[calc(100%+96px)] origin-right bg-primary flex justify-end absolute h-196 left-0 top-0">
        <div
          onClick={() => setIsForSponsors(!isForSponsors)}
          className={`${isForSponsors ? "w-full" : "w-96 hover:w-124"} cursor-pointer transition-all duration-500 bg-foreground group relative`}
        >
          <div className="flex flex-col w-fit h-full pt-4 pb-2 pl-8 justify-between relative pointer-events-none">
            <span
              className={`text-background font-medium text-2xl ${isForSponsors ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
              style={{
                transition: isForSponsors
                  ? "opacity 0.4s, translate 0.4s 0.4s"
                  : "opacity 0.3s 0.6s, translate 0.3s 0.6s",
              }}
            >
              For Sponsors
            </span>
            <ArrowLeftIcon
              className={`w-10 h-10 text-primary opacity-0 transition-all duration-300 translate-x-20 group-hover:translate-x-0 ${isForSponsors ? "" : "group-hover:opacity-100"}`}
            />
          </div>
          <div className="flex flex-col h-full pt-4 pb-2 pl-8 pr-12 justify-between items-end relative pointer-events-none -translate-y-full w-full max-w-400 mx-auto">
            <span
              className={`text-primary font-semibold text-2xl ${isForSponsors ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{
                transition: !isForSponsors
                  ? "opacity 0.4s, translate 0.4s 0.4s"
                  : "opacity 0.1s 0.6s, translate 0.4s 0.6s",
              }}
            >
              For Hosts
            </span>
            <ArrowRightIcon
              className={`w-10 h-10 text-primary opacity-0 transition-all duration-300 -translate-x-20  ${isForSponsors ? "group-hover:opacity-100 group-hover:translate-x-0" : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface BenefitItemProps {
  description: string
  icon: React.ReactNode
  className?: string
}

const BenefitItem = ({ description, icon, className }: BenefitItemProps) => {
  return (
    <div
      className={`flex items-center gap-4 group-data-[active=true]:opacity-100 opacity-0 translate-y-4 group-data-[active=true]:translate-y-0 transition-all duration-300 ${className}`}
    >
      <div className="p-3 bg-background/20 rounded-lg">
        <div className="text-background">{icon}</div>
      </div>
      <p className="text-lg font-medium text-background">{description}</p>
    </div>
  )
}
