// Method API Integration Layer
// This handles all interactions with Method Financial's API

export interface MethodAccount {
  id: string
  holder_id: string
  status: "active" | "inactive" | "pending"
  type: "ach" | "liability"
  liability?: {
    mch: string
    mask: string
    name: string
    type: "credit_card" | "loan" | "mortgage"
    balance: number
    last_payment_date: string
    last_payment_amount: number
    next_payment_due_date: string
    next_payment_minimum_amount: number
  }
  ach?: {
    routing: string
    number: string
    type: "checking" | "savings"
  }
}

export interface MethodPayment {
  id: string
  amount: number
  status: "pending" | "processing" | "sent" | "failed" | "canceled" | "returned"
  description: string
  source: string
  destination: string
  created_at: string
  updated_at: string
  estimated_completion_date: string
}

export interface MethodHolder {
  id: string
  type: "individual"
  individual: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
}

class MethodAPI {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.METHOD_API_URL || "https://production.methodfi.com"
    this.apiKey = process.env.METHOD_API_KEY || "demo_key"
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`Method API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Method API request failed:", error)
      throw error
    }
  }

  // Create a new holder (user account)
  async createHolder(firstName: string, lastName: string, email: string, phone: string): Promise<MethodHolder> {
    return this.request("/holders", {
      method: "POST",
      body: JSON.stringify({
        type: "individual",
        individual: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
        },
      }),
    })
  }

  // Get holder information
  async getHolder(holderId: string): Promise<MethodHolder> {
    return this.request(`/holders/${holderId}`)
  }

  // Get all accounts for a holder
  async getAccounts(holderId: string): Promise<MethodAccount[]> {
    const response = await this.request(`/holders/${holderId}/accounts`)
    return response.data || []
  }

  // Get credit cards (liability accounts) for a holder
  async getCreditCards(holderId: string): Promise<MethodAccount[]> {
    const accounts = await this.getAccounts(holderId)
    return accounts.filter((account) => account.type === "liability" && account.liability?.type === "credit_card")
  }

  // Create a payment from source account to destination account
  async createPayment(
    sourceAccountId: string,
    destinationAccountId: string,
    amount: number,
    description: string,
  ): Promise<MethodPayment> {
    return this.request("/payments", {
      method: "POST",
      body: JSON.stringify({
        amount,
        source: sourceAccountId,
        destination: destinationAccountId,
        description,
      }),
    })
  }

  // Get payment details
  async getPayment(paymentId: string): Promise<MethodPayment> {
    return this.request(`/payments/${paymentId}`)
  }

  // Get all payments for a holder
  async getPayments(holderId: string): Promise<MethodPayment[]> {
    const response = await this.request(`/holders/${holderId}/payments`)
    return response.data || []
  }

  // Cancel a payment
  async cancelPayment(paymentId: string): Promise<MethodPayment> {
    return this.request(`/payments/${paymentId}`, {
      method: "DELETE",
    })
  }

  // Simulate account connection (for demo purposes)
  async simulateAccountConnection(holderId: string, accountType: "credit_card" | "checking"): Promise<MethodAccount> {
    // In a real implementation, this would use Method's account connection flow
    const mockAccount: MethodAccount = {
      id: `acc_${Math.random().toString(36).substr(2, 9)}`,
      holder_id: holderId,
      status: "active",
      type: accountType === "credit_card" ? "liability" : "ach",
      ...(accountType === "credit_card"
        ? {
            liability: {
              mch: "424242",
              mask: "4242",
              name: "Chase Sapphire Preferred",
              type: "credit_card",
              balance: 2340.5,
              last_payment_date: "2024-01-15",
              last_payment_amount: 500.0,
              next_payment_due_date: "2024-02-15",
              next_payment_minimum_amount: 75.0,
            },
          }
        : {
            ach: {
              routing: "021000021",
              number: "1234",
              type: "checking",
            },
          }),
    }

    return mockAccount
  }
}

export const methodAPI = new MethodAPI()
