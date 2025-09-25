"use client"

import { trpc } from "@/lib/trpc/provider"

export default function ClientUserInfo() {
  const { data: user, isLoading, error } = trpc.user.getUserInfo.useQuery()

  if (isLoading) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">Client Component - User Info</h3>
        <p>Loading user information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4">
        <h3 className="mb-2 text-lg font-semibold text-red-800">Client Component Error</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">Client Component - User Info</h3>
        <p>No user data available</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 text-lg font-semibold">Client Component - User Info</h3>
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
          <strong>Email Verified:</strong> {user.supabaseMetadata.is_email_verified ? "Yes" : "No"}
        </p>
      </div>
    </div>
  )
}
