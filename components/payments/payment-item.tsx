"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Payment } from "@/lib/api/payments"
import { useToast } from "@/hooks/use-toast"

interface PaymentItemProps {
  payment: Payment
}

export function PaymentItem({ payment }: PaymentItemProps) {
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-success/10 text-success border-success/20"
      case "processing":
        return "bg-primary/10 text-primary border-primary/20"
      case "pending":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "canceled":
        return "bg-muted/10 text-muted-foreground border-muted/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "processing":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "pending":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "failed":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case "canceled":
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleRetryPayment = () => {
    toast({
      title: "Payment retry initiated",
      description: `Retrying payment of $${payment.amount.toLocaleString()} for ${payment.description}. You'll receive a notification when complete.`,
    })
  }

  const handleCancelPayment = () => {
    toast({
      title: "Payment canceled",
      description: `Payment of $${payment.amount.toLocaleString()} has been canceled successfully.`,
    })
  }

  const handleViewDetails = () => {
    toast({
      title: "Payment details",
      description: `Opening detailed view for payment ${payment.id.slice(-8)}...`,
    })
  }

  const getCardBrand = (description: string) => {
    if (description.includes("Chase")) return "Chase"
    if (description.includes("American Express")) return "Amex"
    if (description.includes("Discover")) return "Discover"
    return "Card"
  }

  return (
    <div className="p-6 hover:bg-muted/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {getCardBrand(payment.description) === "Chase" && (
                <div className="h-6 w-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                  C
                </div>
              )}
              {getCardBrand(payment.description) === "Amex" && (
                <div className="h-6 w-6 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">
                  A
                </div>
              )}
              {getCardBrand(payment.description) === "Discover" && (
                <div className="h-6 w-6 bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">
                  D
                </div>
              )}
              {!["Chase", "Amex", "Discover"].includes(getCardBrand(payment.description)) && (
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-card-foreground truncate">{payment.description}</p>
              <Badge className={`${getStatusColor(payment.status)} text-xs`}>
                <span className="flex items-center space-x-1">
                  {getStatusIcon(payment.status)}
                  <span className="capitalize">{payment.status}</span>
                </span>
              </Badge>
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-xs text-muted-foreground">Created: {formatDate(payment.created_at)}</p>
              {payment.estimated_completion_date && (
                <p className="text-xs text-muted-foreground">
                  Estimated completion: {formatDate(payment.estimated_completion_date)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-card-foreground">${(payment.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">ID: {payment.id.slice(-8)}</p>
          </div>
          <div className="flex items-center space-x-2">
            {payment.status === "failed" && (
              <Button size="sm" variant="outline" onClick={handleRetryPayment} className="bg-transparent border-border">
                Retry
              </Button>
            )}
            {(payment.status === "pending" || payment.status === "processing") && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelPayment}
                className="bg-transparent border-border text-destructive hover:text-destructive"
              >
                Cancel
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleViewDetails}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
