import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Never miss a <span className="text-primary">bill payment</span> again
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                AgentPay uses AI to monitor your email, automatically parse bills, and handle payments seamlessly. Your
                personal financial assistant that lives in your inbox.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Bank-level security</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid gap-4">
              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">Electric Bill</p>
                      <p className="text-sm text-muted-foreground">Due in 3 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-card-foreground">$127.50</p>
                    <p className="text-sm text-success">Auto-pay enabled</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pacific Gas & Electric</span>
                  <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs">Scheduled</span>
                </div>
              </Card>

              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">Credit Card</p>
                      <p className="text-sm text-muted-foreground">Due in 7 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-card-foreground">$2,340.00</p>
                    <p className="text-sm text-primary">Reminder set</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Chase Sapphire</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Pending</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
