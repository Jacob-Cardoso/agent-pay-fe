"use client"

import { useSession } from "next-auth/react"

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">
        Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
      </h1>
      <p className="text-muted-foreground">
        Manage your credit cards and automate your bill payments from your dashboard.
      </p>
    </div>
  )
}
