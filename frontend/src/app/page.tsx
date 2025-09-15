import getUserInfo from "@/fetches/user/getUserInfo"
import Link from "next/link"

export default async function Home() {
  const { data: user, error } = await getUserInfo()

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen w-full">
      {user ? (
        <Link href="/dashboard/overview"> Go to Dashboard </Link>
      ) : (
        <Link href="/sign-in"> Sign In </Link>
      )}
    </div>
  )
}
