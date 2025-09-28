import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CreditCardsGrid } from "@/components/dashboard/credit-cards-grid"

export default function CardsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Credit Cards</h1>
            <p className="text-muted-foreground">Manage your connected credit cards and payment settings.</p>
          </div>
          <CreditCardsGrid />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
