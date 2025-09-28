import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      methodAccountId?: string
      phoneNumber?: string
      needsPhoneNumber?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    methodAccountId?: string
    phoneNumber?: string
    needsPhoneNumber?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    methodAccountId?: string
    phoneNumber?: string
    needsPhoneNumber?: boolean
  }
}
