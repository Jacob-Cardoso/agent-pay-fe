"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CreditCard } from "@/lib/api/cards"
import { useToast } from "@/hooks/use-toast"

interface CreditCardItemProps {
  card: CreditCard
}

export function CreditCardItem({ card }: CreditCardItemProps) {
  const { data: session } = useSession()
  const [autoPayEnabled, setAutoPayEnabled] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderDays, setReminderDays] = useState("3")
  const [reminderMethod, setReminderMethod] = useState("email")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const methodCard = card.method_card
  const liability = methodCard.liability
  
  // Handle cases where we don't have liability data yet
  const balance = liability?.balance || methodCard.balance || 0
  const dueDate = liability?.next_payment_due_date ? new Date(liability.next_payment_due_date) : null
  const today = new Date()
  const daysUntilDue = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null
  const minimumPayment = liability?.next_payment_minimum_amount || 0

  const getCardBrandColor = (brand: string) => {
    const brandLower = brand.toLowerCase()
    if (brandLower.includes("visa")) return "from-blue-500 to-blue-600"
    if (brandLower.includes("mastercard")) return "from-red-500 to-red-600"
    if (brandLower.includes("amex") || brandLower.includes("american")) return "from-green-500 to-green-600"
    if (brandLower.includes("discover")) return "from-orange-500 to-orange-600"
    return "from-gray-500 to-gray-600"
  }

  const getCardBrandLogo = (brand: string) => {
    const brandLower = brand.toLowerCase()
    if (brandLower.includes("visa")) return "VISA"
    if (brandLower.includes("mastercard")) return "MC"
    if (brandLower.includes("amex") || brandLower.includes("american")) return "AMEX"
    if (brandLower.includes("discover")) return "DISC"
    return "CARD"
  }

  const handleAutoPayToggle = (enabled: boolean) => {
    setAutoPayEnabled(enabled)
    toast({
      title: enabled ? "Auto-pay enabled" : "Auto-pay disabled",
      description: enabled
        ? `Minimum payments will be automatically made for ${methodCard.name}`
        : `Auto-pay has been disabled for ${methodCard.name}`,
    })
  }

  const handleReminderToggle = (enabled: boolean) => {
    setReminderEnabled(enabled)
    toast({
      title: enabled ? "Reminders enabled" : "Reminders disabled",
      description: enabled
        ? `You'll receive payment reminders for ${methodCard.name}`
        : `Payment reminders have been disabled for ${methodCard.name}`,
    })
  }

  const makePayment = async () => {
    try {
      setIsLoading(true)
      
      console.log('🚀 Starting payment process...')
      console.log('Payment data:', {
        amount: minimumPayment,
        source: "placeholder_bank_account",
        destination: methodCard.id,
        description: `Payment for ${methodCard.name}`
      })

      // Use the payments API to create payment
      const { paymentsAPI } = await import('@/lib/api/payments')
      
      const paymentData = await paymentsAPI.createPayment({
        amount: minimumPayment, // Already in cents from backend
        source: "placeholder_bank_account", // TODO: Get user's bank account
        destination: methodCard.id,
        description: `Payment for ${methodCard.name}`
      })

      console.log('Payment response:', paymentData)

      if (paymentData) {
        toast({
          title: "Payment created! 🎉",
          description: `Payment of $${(minimumPayment / 100).toFixed(2)} has been initiated for ${methodCard.name}`,
        })
      } else {
        throw new Error('Payment failed - no response data')
      }
    } catch (error) {
      console.error('Payment error details:', error)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        {/* Credit Card Visual */}
        <div
          className={`relative h-48 rounded-lg bg-gradient-to-br ${getCardBrandColor(methodCard.brand)} p-6 text-white`}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="text-sm opacity-80">Balance</div>
              <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1">Due Date</div>
              <div className="text-sm font-semibold">
                {dueDate ? dueDate.toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-lg font-mono tracking-wider">•••• •••• •••• {methodCard.last_four}</div>
                <div className="text-sm opacity-80 mt-1">{methodCard.name}</div>
              </div>
              <div className="text-sm font-bold bg-white/20 px-2 py-1 rounded">{getCardBrandLogo(methodCard.brand)}</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Minimum Payment</div>
            <div className="font-semibold text-card-foreground">${(minimumPayment / 100).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Days Until Due</div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-card-foreground">
                {daysUntilDue !== null ? daysUntilDue : 'N/A'}
              </span>
              {daysUntilDue !== null && daysUntilDue <= 3 && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
              {daysUntilDue !== null && daysUntilDue > 3 && daysUntilDue <= 7 && (
                <Badge variant="secondary" className="text-xs">
                  Soon
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Auto-pay Settings */}
        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor={`autopay-${card.id}`} className="text-sm font-medium text-card-foreground">
                Auto-pay
              </Label>
              <p className="text-xs text-muted-foreground">Automatically pay minimum amount</p>
            </div>
            <Switch
              id={`autopay-${card.id}`}
              checked={autoPayEnabled}
              onCheckedChange={handleAutoPayToggle}
              className="data-[state=checked]:bg-success"
            />
          </div>

          {/* Reminder Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor={`reminder-${card.id}`} className="text-sm font-medium text-card-foreground">
                  Payment Reminders
                </Label>
                <p className="text-xs text-muted-foreground">Get notified before due date</p>
              </div>
              <Switch
                id={`reminder-${card.id}`}
                checked={reminderEnabled}
                onCheckedChange={handleReminderToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {reminderEnabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Days in advance</Label>
                  <Select value={reminderDays} onValueChange={setReminderDays}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Method</Label>
                  <Select value={reminderMethod} onValueChange={setReminderMethod}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
            <Button 
              onClick={makePayment} 
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${(minimumPayment / 100).toFixed(2)} Now`
              )}
            </Button>
      </CardContent>
    </Card>
  )
}
