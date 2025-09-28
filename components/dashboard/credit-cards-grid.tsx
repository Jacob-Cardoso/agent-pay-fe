"use client"

import { CreditCardItem } from "./credit-card-item"
import { mockCreditCards } from "@/lib/mock-data"

export function CreditCardsGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Credit Cards</h2>
          <p className="text-sm text-muted-foreground mt-1">Cards are automatically connected when you sign up</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockCreditCards.map((card) => (
          <CreditCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
