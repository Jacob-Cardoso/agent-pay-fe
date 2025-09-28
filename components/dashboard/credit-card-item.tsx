"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MethodAccount } from "@/lib/method-api"
import { useToast } from "@/hooks/use-toast"

interface CreditCardItemProps {
  card: MethodAccount
}

export function CreditCardItem({ card }: CreditCardItemProps) {
  const [autoPayEnabled, setAutoPayEnabled] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderDays, setReminderDays] = useState("3")
  const [reminderMethod, setReminderMethod] = useState("email")
  const { toast } = useToast()

  const liability = card.liability
  if (!liability) return null

  const dueDate = new Date(liability.next_payment_due_date)
  const today = new Date()
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const getCardBrandColor = (mch: string) => {
    if (mch.startsWith("4")) return "from-blue-500 to-blue-600" // Visa
    if (mch.startsWith("5")) return "from-red-500 to-red-600" // Mastercard
    if (mch.startsWith("3")) return "from-green-500 to-green-600" // Amex
    if (mch.startsWith("6")) return "from-orange-500 to-orange-600" // Discover
    return "from-gray-500 to-gray-600"
  }

  const getCardBrandLogo = (mch: string) => {
    if (mch.startsWith("4")) return "VISA"
    if (mch.startsWith("5")) return "MC"
    if (mch.startsWith("3")) return "AMEX"
    if (mch.startsWith("6")) return "DISC"
    return "CARD"
  }

  const handleAutoPayToggle = (enabled: boolean) => {
    setAutoPayEnabled(enabled)
    toast({
      title: enabled ? "Auto-pay enabled" : "Auto-pay disabled",
      description: enabled
        ? `Minimum payments will be automatically made for ${liability.name}`
        : `Auto-pay has been disabled for ${liability.name}`,
    })
  }

  const handleReminderToggle = (enabled: boolean) => {
    setReminderEnabled(enabled)
    toast({
      title: enabled ? "Reminders enabled" : "Reminders disabled",
      description: enabled
        ? `You'll receive payment reminders for ${liability.name}`
        : `Payment reminders have been disabled for ${liability.name}`,
    })
  }

  const makePayment = () => {
    toast({
      title: "Payment initiated",
      description: `Payment of $${liability.next_payment_minimum_amount} has been scheduled for ${liability.name}`,
    })
  }

  return (
    <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        {/* Credit Card Visual */}
        <div
          className={`relative h-48 rounded-lg bg-gradient-to-br ${getCardBrandColor(liability.mch)} p-6 text-white`}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="text-sm opacity-80">Balance</div>
              <div className="text-2xl font-bold">${liability.balance.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1">Due Date</div>
              <div className="text-sm font-semibold">{dueDate.toLocaleDateString()}</div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-lg font-mono tracking-wider">•••• •••• •••• {liability.mask}</div>
                <div className="text-sm opacity-80 mt-1">{liability.name}</div>
              </div>
              <div className="text-sm font-bold bg-white/20 px-2 py-1 rounded">{getCardBrandLogo(liability.mch)}</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Minimum Payment</div>
            <div className="font-semibold text-card-foreground">${liability.next_payment_minimum_amount}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Days Until Due</div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-card-foreground">{daysUntilDue}</span>
              {daysUntilDue <= 3 && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
              {daysUntilDue > 3 && daysUntilDue <= 7 && (
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
        <Button onClick={makePayment} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Pay ${liability.next_payment_minimum_amount} Now
        </Button>
      </CardContent>
    </Card>
  )
}
