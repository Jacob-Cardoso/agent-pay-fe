import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CreditCardsGrid } from "@/components/dashboard/credit-cards-grid"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickStats } from "@/components/dashboard/quick-stats"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          <DashboardHeader />
          <QuickStats />
          <CreditCardsGrid />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
