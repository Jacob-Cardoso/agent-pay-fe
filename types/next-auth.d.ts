import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      methodAccountId?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    methodAccountId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    methodAccountId?: string
  }
}
