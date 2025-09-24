import getUserInfo from "@/fetches/user/getUserInfo"
import Link from "next/link"

export default async function Home() {
  const { data: user, error } = await getUserInfo()

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      {user ? (
        <Link href="/dashboard/overview"> Go to Dashboard </Link>
      ) : (
        <Link href="/sign-in"> Sign In </Link>
      )}
    </div>
  )
}
