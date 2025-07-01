import ForHostOrSponsor from "@/features/home/landing/for-host-or-sponsor"
import Hero from "@/features/home/landing/hero"
import HostOrSponsor from "@/features/home/landing/host-or-sponsor"
import HowItWorks from "@/features/home/landing/how-it-works"
import TheProblem from "@/features/home/landing/the-problem"
import TheSolution from "@/features/home/landing/the-solution"

export default function page() {
  return (
    <main className="flex flex-col min-h-screen xl:px-12 lg:px-10 md:px-8 px-4 mb-24">
      <Hero />
      <HostOrSponsor />
      <TheProblem />
      <ForHostOrSponsor />
      <TheSolution />
      <HowItWorks />
    </main>
  )
}
