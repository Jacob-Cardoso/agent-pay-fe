export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  methodAccountId?: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const isAuthenticated = localStorage.getItem("isAuthenticated")
  const userEmail = localStorage.getItem("userEmail")
  const methodAccountId = localStorage.getItem("methodAccountId")

  if (isAuthenticated === "true" && userEmail) {
    return {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      email: userEmail,
      firstName: "John", // In a real app, this would come from your database
      lastName: "Doe",
      methodAccountId: methodAccountId || undefined,
    }
  }

  return null
}

export function logout() {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("methodAccountId")
  window.location.href = "/login"
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAuthenticated") === "true"
}
