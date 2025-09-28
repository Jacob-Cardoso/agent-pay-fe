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

        try {
          // Call our FastAPI backend for authentication
          const API_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.error('Authentication failed:', response.status);
            return null;
          }

          const authData = await response.json();
          
          if (authData.access_token && authData.user) {
            return {
              id: authData.user.id,
              email: authData.user.email,
              name: authData.user.full_name || authData.user.email,
              methodAccountId: authData.user.method_account_id,
              phoneNumber: authData.user.phone_number,
              accessToken: authData.access_token,
            }
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user data to the token right after signin
      if (user) {
        token.methodAccountId = user.methodAccountId || null
        token.phoneNumber = user.phoneNumber || null
        
        // Create Method account on first sign in
        if (!user.methodAccountId) {
          try {
            const methodAccount = await createMethodAccount(user.email!, user.name!, user.phoneNumber)
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
        session.user.phoneNumber = token.phoneNumber as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // For Google OAuth, check if this is first time login
      if (account?.provider === "google" && profile) {
        // If no phone number from Google, we'll need to collect it
        if (!profile.phone) {
          // Store a flag to show phone collection modal
          user.needsPhoneNumber = true
        }
      }
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
async function createMethodAccount(email: string, name: string, phoneNumber?: string) {
  // TODO: Replace with actual Method API integration
  console.log('Creating Method account for:', { email, name, phoneNumber })
  return {
    id: `method_${Math.random().toString(36).substr(2, 9)}`,
    status: "active"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }