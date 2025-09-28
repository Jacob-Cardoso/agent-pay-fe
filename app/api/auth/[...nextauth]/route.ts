import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import type { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // TODO: Replace with actual user authentication logic
        // For now, we'll simulate authentication
        try {
          // In production, verify credentials against your database
          const user = {
            id: `user_${Math.random().toString(36).substr(2, 9)}`,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            methodAccountId: null
          }

          return user
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user data to the token right after signin
      if (user) {
        token.methodAccountId = user.methodAccountId || null
        
        // Create Method account on first sign in
        if (!user.methodAccountId) {
          try {
            const methodAccount = await createMethodAccount(user.email!, user.name!)
            token.methodAccountId = methodAccount.id
            // In production, save this to your database
          } catch (error) {
            console.error("Failed to create Method account:", error)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.sub!
        session.user.methodAccountId = token.methodAccountId as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Mock function to create Method account - replace with actual Method API call
async function createMethodAccount(email: string, name: string) {
  // TODO: Replace with actual Method API integration
  return {
    id: `method_${Math.random().toString(36).substr(2, 9)}`,
    status: "active"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
