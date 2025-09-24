import { api } from "@/lib/trpc/server"

export default async function ServerUserInfo() {
  try {
    const caller = await api()
    const user = await caller.user.getUserInfo()

    return (
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">Server Component - User Info</h3>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email Verified:</strong>{" "}
            {user.supabaseMetadata.we_verified_email ? "Yes" : "No"}
          </p>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4">
        <h3 className="mb-2 text-lg font-semibold text-red-800">Server Component Error</h3>
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Failed to fetch user info"}
        </p>
      </div>
    )
  }
}
