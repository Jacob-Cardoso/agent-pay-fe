import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BillsGrid } from "@/components/dashboard/bills-grid"

export default function BillsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Bills</h1>
            <p className="text-muted-foreground">Manage and pay your monthly bills.</p>
          </div>
          <BillsGrid />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
