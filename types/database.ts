export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone_number: string | null
          method_account_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          method_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          method_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      card_preferences: {
        Row: {
          id: string
          user_id: string
          method_card_id: string
          autopay_enabled: boolean
          reminder_days: number
          max_autopay_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          method_card_id: string
          autopay_enabled?: boolean
          reminder_days?: number
          max_autopay_amount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          method_card_id?: string
          autopay_enabled?: boolean
          reminder_days?: number
          max_autopay_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          autopay_enabled: boolean
          default_reminder_days: number
          email_notifications: boolean
          sms_notifications: boolean
          max_autopay_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          autopay_enabled?: boolean
          default_reminder_days?: number
          email_notifications?: boolean
          sms_notifications?: boolean
          max_autopay_amount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          autopay_enabled?: boolean
          default_reminder_days?: number
          email_notifications?: boolean
          sms_notifications?: boolean
          max_autopay_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
