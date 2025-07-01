import LandingFooter from "@/features/home/landing-footer"
import LandingHeader from "@/features/home/landing-header"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingHeader />
      {children}
      <LandingFooter />
    </>
  )
}
