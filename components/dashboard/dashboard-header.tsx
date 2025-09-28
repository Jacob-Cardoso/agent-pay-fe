"use client"

import { getCurrentUser } from "@/lib/auth"

export function DashboardHeader() {
  const user = getCurrentUser()

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.firstName}!</h1>
      <p className="text-muted-foreground">
        Manage your credit cards and automate your bill payments from your dashboard.
      </p>
    </div>
  )
}
