import FadeBarChart from "@/components/icons/fade-bar-chart"
import FadeCircles from "@/components/icons/fade-circles"
import FadeGrid from "@/components/icons/fade-grid"
import FadeStack from "@/components/icons/fade-stack"
import React from "react"

export default function theProblem() {
  return (
    <section className="flex flex-col mt-24 w-full mx-auto max-w-400">
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-sm text-primary uppercase tracking-[.2em]">
          The Problem
        </h2>

        <div className="flex items-end justify-between">
          <h1 className="text-6xl font-bold tracking-tight">
            Digital Advertising Is <br /> Hitting a Wall
          </h1>
          <p className="text-lg font-medium w-102">
            They're gathering in real-world communities and third spaces where
            their attention is genuine and their guard is down.
          </p>
        </div>
      </div>
      <div className="mt-20 grid xl:grid-cols-4 grid-cols-2 gap-8">
        <ProblemCard
          number="40%"
          title="Increase in Ad Blockers"
          image={<FadeBarChart className="w-25.5 h-16" />}
          description="Of internet users globally now use ad blockers, with younger demographics leading adoption"
        />
        <ProblemCard
          number="<0.05%"
          title="Decrease in CTR"
          image={<FadeCircles className="w-26 h-21.25" />}
          description="CTR for digital ads across industries has dropped to an all-time low"
        />
        <ProblemCard
          number="86%"
          title="Ad Fatigued Consumers"
          image={<FadeStack className="w-18.75 h-20.75" />}
          description="Of consumers report 'ad fatigue,' actively ignoring or avoiding online advertisements"
        />
        <ProblemCard
          number="60%"
          title="Increase in Marketing Costs"
          image={<FadeGrid className="w-18.5 h-18.5" />}
          description="Increase in marketing costs over the past five years"
        />
      </div>
    </section>
  )
}

interface ProblemCardProps {
  number: string
  title: string
  description: string
  image: React.ReactNode
}

const ProblemCard = ({
  number,
  title,
  description,
  image,
}: ProblemCardProps) => {
  return (
    <div className="rounded-xl bg-secondary flex flex-col px-4 py-12 items-center">
      <span className="2xl:text-7xl xl:text-6xl text-5xl font-medium text-primary text-center mb-2">
        {number}
      </span>
      <span className="xl:text-xl text-lg font-semibold text-center">
        {title}
      </span>
      <div className="my-12 h-30 w-30 flex items-center justify-center">
        {image}
      </div>
      <p className="text-lg text-center">{description}</p>
    </div>
  )
}
