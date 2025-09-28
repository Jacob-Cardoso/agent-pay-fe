"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function usePhoneCollection() {
  const { data: session, status } = useSession()
  const [showPhoneModal, setShowPhoneModal] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if user needs to provide phone number
      const needsPhone = !session.user.phoneNumber && session.user.needsPhoneNumber
      setShowPhoneModal(needsPhone || false)
    }
  }, [session, status])

  const handlePhoneComplete = async (phoneNumber: string) => {
    try {
      // TODO: Make API call to update user profile with phone number
      console.log("Saving phone number:", phoneNumber)
      
      // For now, just close the modal
      setShowPhoneModal(false)
      
      // In production, you'd update the session or refetch user data
    } catch (error) {
      console.error("Failed to save phone number:", error)
    }
  }

  return {
    showPhoneModal,
    handlePhoneComplete,
  }
}

