"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cardsAPI, type CreditCard } from "@/lib/api/cards"
import { paymentsAPI, type PaymentStats } from "@/lib/api/payments"
import { Loader2 } from "lucide-react"

export function QuickStats() {
  const { data: session } = useSession()
  const [cards, setCards] = useState<CreditCard[]>([])
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    total_amount: 0,
    successful_payments: 0,
    failed_payments: 0,
    pending_payments: 0,
    recent_payments_count: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return
      
      try {
        setIsLoading(true)
        const [fetchedCards, fetchedStats] = await Promise.all([
          cardsAPI.getCreditCards(),
          paymentsAPI.getPaymentStats()
        ])
        setCards(fetchedCards)
        setPaymentStats(fetchedStats)
      } catch (error) {
        console.error('Failed to fetch stats data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session?.user?.id])

  // Calculate stats from the fetched data
  const totalBalance = cards.reduce((sum, card) => {
    const balance = card.method_card.liability?.balance || card.method_card.balance || 0
    return sum + balance
  }, 0)

  const upcomingPayments = cards.filter((card) => {
    const dueDate = card.method_card.liability?.next_payment_due_date
    if (!dueDate) return false
    
    const dueDateObj = new Date(dueDate)
    const today = new Date()
    const daysUntilDue = Math.ceil((dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDue <= 7 && daysUntilDue >= 0
  }).length

  const stats = [
    {
      title: "Total Balance",
      value: isLoading ? "-" : `$${totalBalance.toLocaleString()}`,
      description: "Across all credit cards",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      title: "Upcoming Payments",
      value: isLoading ? "-" : upcomingPayments.toString(),
      description: "Due within 7 days",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Recent Payments",
      value: isLoading ? "-" : paymentStats.recent_payments_count.toString(),
      description: "Last 30 days",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Active Cards",
      value: isLoading ? "-" : cards.length.toString(),
      description: "Connected accounts",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className="text-muted-foreground">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
