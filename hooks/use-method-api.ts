"use client"

import { useState, useEffect } from "react"
import type { MethodAccount, MethodPayment } from "@/lib/method-api"

export function useMethodAccounts(holderId: string | null) {
  const [accounts, setAccounts] = useState<MethodAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!holderId) return

    const fetchAccounts = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/method/accounts?holder_id=${holderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch accounts")
        }
        const data = await response.json()
        setAccounts(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [holderId])

  const connectAccount = async (accountType: "credit_card" | "checking") => {
    if (!holderId) return null

    try {
      const response = await fetch("/api/method/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          holder_id: holderId,
          account_type: accountType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to connect account")
      }

      const data = await response.json()
      const newAccount = data.data

      setAccounts((prev) => [...prev, newAccount])
      return newAccount
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return null
    }
  }

  return {
    accounts,
    loading,
    error,
    connectAccount,
    refetch: () => {
      if (holderId) {
        // Trigger refetch by updating holderId dependency
        setAccounts([])
      }
    },
  }
}

export function useMethodPayments(holderId: string | null) {
  const [payments, setPayments] = useState<MethodPayment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!holderId) return

    const fetchPayments = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/method/payments?holder_id=${holderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch payments")
        }
        const data = await response.json()
        setPayments(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [holderId])

  const createPayment = async (source: string, destination: string, amount: number, description: string) => {
    try {
      const response = await fetch("/api/method/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          destination,
          amount,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment")
      }

      const data = await response.json()
      const newPayment = data.data

      setPayments((prev) => [newPayment, ...prev])
      return newPayment
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return null
    }
  }

  return {
    payments,
    loading,
    error,
    createPayment,
    refetch: () => {
      if (holderId) {
        setPayments([])
      }
    },
  }
}
