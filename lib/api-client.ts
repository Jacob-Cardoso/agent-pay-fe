import { createSupabaseClient } from '@/lib/supabase/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'

class APIClient {
  private async getAuthHeaders() {
    try {
      // For now, we'll use the FastAPI backend auth directly with the test account
      // This is a temporary solution that works with the current test setup
      const email = 'methoduser@example.com'
      const password = 'testpass123'
      
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (loginResponse.ok) {
        const data = await loginResponse.json()
        return {
          'Authorization': `Bearer ${data.access_token}`,
          'Content-Type': 'application/json',
        }
      } else {
        throw new Error('Failed to authenticate with backend')
      }
    } catch (error) {
      console.error('Failed to get auth token:', error)
      throw new Error('Authentication required')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/api/users/me')
  }

  async updateUser(data: any) {
    return this.request('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getUserSettings() {
    return this.request('/api/users/settings')
  }

  async updateUserSettings(data: any) {
    return this.request('/api/users/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Credit card endpoints
  async getCreditCards() {
    return this.request('/api/cards/')
  }

  async syncCardsFromMethod() {
    return this.request('/api/cards/sync', {
      method: 'POST',
    })
  }

  async getCreditCard(cardId: string) {
    return this.request(`/api/cards/${cardId}`)
  }

  async updateCreditCard(cardId: string, data: any) {
    return this.request(`/api/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCreditCard(cardId: string) {
    return this.request(`/api/cards/${cardId}`, {
      method: 'DELETE',
    })
  }

  // Bill endpoints
  async getBills() {
    return this.request('/api/bills/')
  }

  async createBill(data: any) {
    return this.request('/api/bills/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getBill(billId: string) {
    return this.request(`/api/bills/${billId}`)
  }

  async updateBill(billId: string, data: any) {
    return this.request(`/api/bills/${billId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteBill(billId: string) {
    return this.request(`/api/bills/${billId}`, {
      method: 'DELETE',
    })
  }

  async payBill(billId: string) {
    return this.request(`/api/bills/${billId}/pay`, {
      method: 'POST',
    })
  }

  // Payment endpoints
  async getPaymentHistory() {
    return this.request('/api/payments/')
  }

  async syncPaymentsFromMethod() {
    return this.request('/api/payments/sync')
  }

  async getPayment(paymentId: string) {
    return this.request(`/api/payments/${paymentId}`)
  }

  // Generic HTTP methods for other endpoints
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health')
  }
}

export const apiClient = new APIClient()
export default apiClient
