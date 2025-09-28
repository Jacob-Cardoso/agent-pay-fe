'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CreditCard, Building2, CheckCircle, Play } from 'lucide-react'
// Direct API calls for simulation (bypass auth issues)
const API_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'

interface SimulationSetupProps {
  onSimulationComplete?: () => void
}

export function SimulationSetup({ onSimulationComplete }: SimulationSetupProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runFullSimulation = async () => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to run the simulation",
        variant: "destructive"
      })
      return
    }

    try {
      setIsRunning(true)
      setCurrentStep("Setting up simulation account...")
      
      // First, create/login to get backend auth token
      let authToken = ''
      
      // Try to login first
      console.log('Attempting login for email:', session.user.email)
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          password: 'simulation123'
        })
      })
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        authToken = loginData.access_token
        console.log('Login successful, got token')
      } else {
        console.log('Login failed, status:', loginResponse.status, 'trying to register...')
        
        // Login failed, try to register
        const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            password: 'simulation123', // Simple password for simulation
            phone_number: '+15551234567'
          })
        })
        
        if (registerResponse.ok) {
          const registerData = await registerResponse.json()
          authToken = registerData.access_token
          console.log('Registration successful, got token')
        } else {
          const errorText = await registerResponse.text()
          console.log('Registration failed:', registerResponse.status, errorText)
          
          // If registration failed because user exists, try login again
          if (registerResponse.status === 400 || errorText.includes('already registered') || errorText.includes('already exists')) {
            console.log('User already exists, trying login again...')
            const retryLoginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: session.user.email,
                password: 'simulation123'
              })
            })
            
            if (retryLoginResponse.ok) {
              const retryLoginData = await retryLoginResponse.json()
              authToken = retryLoginData.access_token
              console.log('Retry login successful, got token')
            } else {
              throw new Error(`Authentication failed: User exists but login failed - ${retryLoginResponse.status}`)
            }
          } else {
            throw new Error(`Authentication failed: ${registerResponse.status} - ${errorText}`)
          }
        }
      }
      
      setCurrentStep("Creating simulated credit cards and accounts...")
      
      // Now run the simulation with the auth token
      const simulationResponse = await fetch(`${API_BASE_URL}/api/connect/simulate-full-setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!simulationResponse.ok) {
        const errorText = await simulationResponse.text()
        throw new Error(`Simulation failed: ${errorText}`)
      }
      
      const simulationData = await simulationResponse.json()
      
      setResults(simulationData)
      setCompleted(true)
      setCurrentStep(null)
      
      toast({
        title: "Simulation Complete! 🎉",
        description: `Created ${simulationData.setup.credit_cards.total} credit cards and ${simulationData.setup.bank_accounts.total} bank accounts`,
      })

      // Call the callback to refresh the dashboard
      if (onSimulationComplete) {
        onSimulationComplete()
      }

    } catch (error: any) {
      console.error('Simulation failed:', error)
      
      let errorMessage = "Failed to run simulation"
      if (error.message) {
        errorMessage = error.message
      } else if (error.toString) {
        errorMessage = error.toString()
      }
      
      toast({
        title: "Simulation Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      // Log detailed error for debugging
      console.log('Detailed error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        error: error
      })
    } finally {
      setIsRunning(false)
    }
  }

  const runCreditCardSimulation = async () => {
    // For now, just call the full simulation since auth is complex
    await runFullSimulation()
  }

  const runBankAccountSimulation = async () => {
    // For now, just call the full simulation since auth is complex
    await runFullSimulation()
  }

  if (completed && results) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Simulation Complete!</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Your AgentPay demo environment has been set up with simulated data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">{results.setup.credit_cards.total}</div>
              <div className="text-sm text-muted-foreground">Credit Cards</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Building2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">{results.setup.bank_accounts.total}</div>
              <div className="text-sm text-muted-foreground">Bank Accounts</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Visa</Badge>
            <Badge variant="secondary">Mastercard</Badge>
            <Badge variant="secondary">American Express</Badge>
            <Badge variant="secondary">Checking Account</Badge>
            <Badge variant="secondary">Savings Account</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Your dashboard now displays simulated credit cards with realistic balances, due dates, and payment history. 
            You can test the full AgentPay experience including making payments and viewing transaction history.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5" />
          <span>AgentPay Simulation Setup</span>
        </CardTitle>
        <CardDescription>
          Create simulated credit cards and bank accounts to test the full AgentPay experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Button
            onClick={runFullSimulation}
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning && currentStep ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {currentStep}
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Complete Simulation
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">or set up individually</div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={runCreditCardSimulation}
              disabled={isRunning}
              className="flex-col h-auto py-4"
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span>Add Credit Cards</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={runBankAccountSimulation}
              disabled={isRunning}
              className="flex-col h-auto py-4"
            >
              <Building2 className="h-6 w-6 mb-2" />
              <span>Add Bank Account</span>
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">What gets created:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 3 Credit cards (Visa, Mastercard, American Express)</li>
            <li>• 2 Bank accounts (Checking and Savings)</li>
            <li>• Realistic balances and due dates</li>
            <li>• Sample payment history</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
