import { api } from "@/lib/trpc/server"
import Link from "next/link"

export default async function Home() {
  const apiCaller = await api()
  const user = await apiCaller.user.getUserInfo()

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      {user ? (
        <Link href="/dashboard/overview">Go to Dashboard</Link>
      ) : (
        <Link href="/sign-in">Sign In</Link>
      )}
    </div>
  )
}
