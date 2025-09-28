import { apiClient } from '@/lib/api-client'

export interface Payment {
  id: string;
  amount: number;
  source: string;
  destination: string;
  description: string;
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'canceled';
  created_at: string;
  updated_at: string;
  metadata?: {
    user_id: string;
    entity_id: string;
  };
}

export interface PaymentStats {
  total_amount: number;
  successful_payments: number;
  failed_payments: number;
  pending_payments: number;
  recent_payments_count: number;
}

class PaymentsAPI {
  async getPaymentHistory(options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Payment[]> {
    try {
      const params = new URLSearchParams()
      if (options?.status) params.append('status', options.status)
      if (options?.limit) params.append('limit', options.limit.toString())
      if (options?.offset) params.append('offset', options.offset.toString())
      
      const queryString = params.toString()
      const endpoint = `/api/payments/${queryString ? `?${queryString}` : ''}`
      
      const response = await apiClient.get(endpoint)
      // Handle both array responses and {data: []} wrapper responses
      if (Array.isArray(response)) {
        return response
      } else if (response && response.data && Array.isArray(response.data)) {
        return response.data
      } else {
        return []
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error)
      return []
    }
  }

  async createPayment(paymentData: {
    amount: number;
    source: string;
    destination: string;
    description: string;
  }): Promise<Payment | null> {
    try {
      console.log('💳 PaymentsAPI: Sending payment request:', paymentData)
      const response = await apiClient.post('/api/payments/', paymentData)
      console.log('💳 PaymentsAPI: Received response:', response)
      return response
    } catch (error) {
      console.error('💳 PaymentsAPI: Failed to create payment:', error)
      return null
    }
  }

  async getPaymentStats(): Promise<PaymentStats> {
    try {
      // For now, calculate stats from payment history
      const payments = await this.getPaymentHistory()
      
      const stats = payments.reduce((acc, payment) => {
        acc.total_amount += payment.amount / 100 // Convert from cents
        
        switch (payment.status) {
          case 'sent':
            acc.successful_payments += 1
            break
          case 'failed':
            acc.failed_payments += 1
            break
          case 'pending':
          case 'processing':
            acc.pending_payments += 1
            break
        }
        
        return acc
      }, {
        total_amount: 0,
        successful_payments: 0,
        failed_payments: 0,
        pending_payments: 0,
        recent_payments_count: payments.length
      })
      
      return stats
    } catch (error) {
      console.error('Failed to fetch payment stats:', error)
      return {
        total_amount: 0,
        successful_payments: 0,
        failed_payments: 0,
        pending_payments: 0,
        recent_payments_count: 0
      }
    }
  }
}

export const paymentsAPI = new PaymentsAPI()