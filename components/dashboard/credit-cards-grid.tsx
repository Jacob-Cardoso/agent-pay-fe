"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CreditCardItem } from "./credit-card-item"
import { cardsAPI, type CreditCard } from "@/lib/api/cards"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function CreditCardsGrid() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [cards, setCards] = useState<CreditCard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCards = async () => {
    if (!session?.user?.id) return
    
    try {
      setIsLoading(true)
      const fetchedCards = await cardsAPI.getCreditCards()
      setCards(fetchedCards)
    } catch (error) {
      console.error('Failed to fetch credit cards:', error)
      toast({
        title: "Error",
        description: "Failed to load credit cards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [session?.user?.id, toast])


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Credit Cards</h2>
            <p className="text-sm text-muted-foreground mt-1">Loading your connected credit cards...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Credit Cards</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {cards.length > 0 
              ? `${cards.length} card${cards.length === 1 ? '' : 's'} connected` 
              : "No credit cards found. Connect your cards to get started."
            }
          </p>
        </div>
      </div>

          {cards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No credit cards connected yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Connect your credit cards to start managing payments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {cards.map((card) => (
                <CreditCardItem key={card.id} card={card} />
              ))}
            </div>
          )}
    </div>
  )
}
