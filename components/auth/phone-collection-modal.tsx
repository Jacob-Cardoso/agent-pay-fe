"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface PhoneCollectionModalProps {
  isOpen: boolean
  onComplete: (phoneNumber: string) => void
}

export function PhoneCollectionModal({ isOpen, onComplete }: PhoneCollectionModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Make API call to save phone number to user profile
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "Phone number saved!",
        description: "Your account setup is now complete.",
      })
      
      onComplete(phoneNumber)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save phone number. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Account Setup</DialogTitle>
          <DialogDescription>
            We need your phone number to complete your AgentPay account and enable payment notifications.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="bg-background border-input"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !phoneNumber.trim()}
            >
              {isLoading ? "Saving..." : "Continue"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip for now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

