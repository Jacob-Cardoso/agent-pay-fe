"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, DollarSign, Zap, Wifi, Flame, Droplets, Shield } from "lucide-react"

interface Bill {
  id: string
  company: string
  type: string
  amount: number // in cents
  dueDate: string
  status: "pending" | "paid" | "overdue"
  accountNumber: string
  description: string
  icon: string
}

const mockBills: Bill[] = [
  {
    id: "bill_001",
    company: "Hydro One",
    type: "Electricity",
    amount: 12500, // $125.00
    dueDate: "2025-10-15",
    status: "pending",
    accountNumber: "****1234",
    description: "Monthly electricity bill",
    icon: "zap"
  },
  {
    id: "bill_002", 
    company: "Rogers",
    type: "Internet & Phone",
    amount: 8900, // $89.00
    dueDate: "2025-10-20",
    status: "pending",
    accountNumber: "****5678",
    description: "Internet and phone services",
    icon: "wifi"
  },
  {
    id: "bill_003",
    company: "Enbridge",
    type: "Natural Gas",
    amount: 6750, // $67.50
    dueDate: "2025-10-12",
    status: "overdue",
    accountNumber: "****9012",
    description: "Monthly gas bill",
    icon: "flame"
  },
  {
    id: "bill_004",
    company: "Toronto Water",
    type: "Water & Sewer",
    amount: 4500, // $45.00
    dueDate: "2025-10-25",
    status: "pending",
    accountNumber: "****3456",
    description: "Water and sewer services",
    icon: "droplets"
  },
  {
    id: "bill_005",
    company: "Intact Insurance",
    type: "Auto Insurance",
    amount: 15600, // $156.00
    dueDate: "2025-10-30",
    status: "pending",
    accountNumber: "****7890",
    description: "Monthly auto insurance",
    icon: "shield"
  }
]

const getIcon = (iconName: string) => {
  const icons = {
    zap: Zap,
    wifi: Wifi,
    flame: Flame,
    droplets: Droplets,
    shield: Shield
  }
  const IconComponent = icons[iconName as keyof typeof icons] || DollarSign
  return <IconComponent className="h-6 w-6" />
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-200"
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
  }
}

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function BillsGrid() {
  const [bills, setBills] = useState<Bill[]>(mockBills)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePayBill = async (bill: Bill) => {
    setIsLoading(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update bill status
      setBills(prevBills => 
        prevBills.map(b => 
          b.id === bill.id 
            ? { ...b, status: "paid" as const }
            : b
        )
      )

      toast({
        title: "Payment Successful! 🎉",
        description: `Paid $${(bill.amount / 100).toFixed(2)} to ${bill.company}`,
      })
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalPending = bills
    .filter(bill => bill.status === "pending" || bill.status === "overdue")
    .reduce((sum, bill) => sum + bill.amount, 0)

  const overdueCount = bills.filter(bill => bill.status === "overdue").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalPending / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {bills.filter(b => b.status !== "paid").length} bills pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Bills</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bills.length}</div>
            <p className="text-xs text-muted-foreground">
              Total bills to pay
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bills Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bills.map((bill) => {
          const daysUntilDue = getDaysUntilDue(bill.dueDate)
          
          return (
            <Card key={bill.id} className="bg-card border border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getIcon(bill.icon)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bill.company}</CardTitle>
                      <p className="text-sm text-muted-foreground">{bill.type}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(bill.status)}>
                    {bill.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount Due</span>
                  <span className="text-xl font-bold">
                    ${(bill.amount / 100).toFixed(2)}
                  </span>
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {mounted ? new Date(bill.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }) : bill.dueDate}
                    </div>
                    {mounted && (
                      <div className={`text-xs ${
                        daysUntilDue < 0 
                          ? "text-red-600" 
                          : daysUntilDue <= 3 
                          ? "text-yellow-600" 
                          : "text-muted-foreground"
                      }`}>
                        {daysUntilDue < 0 
                          ? `${Math.abs(daysUntilDue)} days overdue`
                          : daysUntilDue === 0
                          ? "Due today"
                          : `${daysUntilDue} days remaining`
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Account */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account</span>
                  <span className="text-sm font-mono">{bill.accountNumber}</span>
                </div>

                {/* Pay Button */}
                <Button 
                  className="w-full" 
                  onClick={() => handlePayBill(bill)}
                  disabled={isLoading || bill.status === "paid"}
                  variant={bill.status === "overdue" ? "destructive" : "default"}
                >
                  {isLoading ? "Processing..." : 
                   bill.status === "paid" ? "Paid ✓" :
                   bill.status === "overdue" ? `Pay Overdue $${(bill.amount / 100).toFixed(2)}` :
                   `Pay $${(bill.amount / 100).toFixed(2)}`
                  }
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
