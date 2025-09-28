import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PaymentHistory } from "@/components/payments/payment-history"

export default function PaymentsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <PaymentHistory />
      </DashboardLayout>
    </AuthGuard>
  )
}
