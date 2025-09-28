import { apiClient } from '@/lib/api-client'

export interface CreditCard {
  id: string
  method_card: {
    id: string
    type: string
    brand: string
    last_four: string
    name: string
    status: string
    balance: number
    exp_month: number
    exp_year: number
    liability?: {
      mch: string
      mask: string
      name: string
      type: string
      balance: number
      last_payment_date?: string
      last_payment_amount?: number
      next_payment_due_date?: string
      next_payment_minimum_amount?: number
    }
  }
  preferences?: {
    autopay_enabled: boolean
    autopay_amount: string
    reminder_days: number
    notifications_enabled: boolean
  }
}

export interface ApiError {
  detail: string
}

class CardsAPI {
  async getCreditCards(): Promise<CreditCard[]> {
    try {
      const response = await apiClient.get('/api/cards/')
      const rawCards = response || []
      
      // Transform backend data to match frontend interface
      return rawCards.map((cardWrapper: any) => {
        const card = cardWrapper.method_card
        return {
          id: card.id,
          method_card: {
            id: card.id,
            type: card.type || 'liability',
            brand: card.brand || 'visa',
            last_four: card.last_four || '0000',
            name: card.name || `${card.brand?.toUpperCase()} Credit Card`,
            status: card.status || 'active',
            balance: card.balance || 0,
            exp_month: card.exp_month || 12,
            exp_year: card.exp_year || 2025,
            liability: card.liability || {
              mch: card.last_four || '0000',
              mask: card.last_four || '0000',
              name: card.name || `${card.brand?.toUpperCase()} Credit Card`,
              type: 'credit_card',
              balance: card.balance || 0,
              last_payment_date: card.liability?.last_payment_date,
              last_payment_amount: card.liability?.last_payment_amount,
              next_payment_due_date: card.liability?.next_payment_due_date,
              next_payment_minimum_amount: card.liability?.next_payment_minimum_amount
            }
          },
          preferences: cardWrapper.preferences || {
            autopay_enabled: false,
            autopay_amount: 'minimum',
            reminder_days: 3,
            notifications_enabled: true
          }
        }
      })
    } catch (error: any) {
      console.error('Failed to fetch credit cards:', error)
      // Return empty array on error to avoid breaking the UI
      return []
    }
  }

  async updateCardPreferences(cardId: string, preferences: Partial<CreditCard['preferences']>): Promise<void> {
    await apiClient.put(`/api/cards/${cardId}/preferences`, preferences)
  }

  async getCardPreferences(cardId: string): Promise<CreditCard['preferences']> {
    const response = await apiClient.get(`/api/cards/${cardId}/preferences`)
    return response.data
  }
}

export const cardsAPI = new CardsAPI()
