import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Session } from "next-auth"

export interface User {
  id: string
  email: string
  name: string
  image?: string
  methodAccountId?: string
}

// Server-side function to get current session
export async function getServerAuthSession() {
  return await getServerSession(authOptions)
}

// Client-side hook will be used in components
export function extractUserFromSession(session: Session | null): User | null {
  if (!session?.user) return null
  
  return {
    id: session.user.id || "",
    email: session.user.email || "",
    name: session.user.name || "",
    image: session.user.image || undefined,
    methodAccountId: session.user.methodAccountId || undefined,
  }
}

// Legacy function for compatibility - will be replaced with useSession hook
export function getCurrentUser(): User | null {
  // This will be handled by useSession hook in components
  return null
}

// Legacy function - will be replaced with signOut from next-auth
export function logout() {
  // This will be handled by signOut from next-auth
  if (typeof window !== "undefined") {
    window.location.href = "/api/auth/signout"
  }
}

// Legacy function - will be replaced with session status
export function isAuthenticated(): boolean {
  // This will be handled by session status in components
  return false
}
