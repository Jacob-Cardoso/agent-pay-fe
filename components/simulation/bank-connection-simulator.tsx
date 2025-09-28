'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Building2, Zap } from 'lucide-react';

interface BankAccount {
  id: string;
  type: string;
  bank_name: string;
  last_four: string;
  status: string;
  balance?: number;
  routing_number?: string;
}

interface SimulationResponse {
  success: boolean;
  message: string;
  account?: any;
  accounts?: any[];
  simulation: boolean;
}

export default function BankConnectionSimulator() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [hasSimulated, setHasSimulated] = useState(false);

  const simulateBankConnection = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to simulate bank connection",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/connect/simulate-connection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.user.id}`, // In real app, use proper JWT token
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SimulationResponse = await response.json();
      
      if (data.success) {
        toast({
          title: "🎭 Simulation Success!",
          description: data.message,
        });
        
        setHasSimulated(true);
        await loadBankAccounts();
      } else {
        throw new Error('Simulation failed');
      }
      
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Failed",
        description: "Failed to simulate bank connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateMultipleAccounts = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to simulate bank connections",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/connect/simulate-multiple-accounts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.user.id}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SimulationResponse = await response.json();
      
      if (data.success) {
        toast({
          title: "🎭 Multiple Accounts Created!",
          description: `${data.accounts?.length || 0} simulated accounts created`,
        });
        
        setHasSimulated(true);
        await loadBankAccounts();
      } else {
        throw new Error('Multiple account simulation failed');
      }
      
    } catch (error) {
      console.error('Multiple account simulation error:', error);
      toast({
        title: "Simulation Failed",
        description: "Failed to simulate multiple accounts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadBankAccounts = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/connect/bank-accounts`, {
        headers: {
          'Authorization': `Bearer ${session.user.id}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBankAccounts(data.bank_accounts || []);
      
    } catch (error) {
      console.error('Failed to load bank accounts:', error);
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return <CreditCard className="h-4 w-4" />;
      case 'savings':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Bank Connection Simulator
          </CardTitle>
          <CardDescription>
            🎭 Simulate bank account connections for development testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={simulateBankConnection}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Building2 className="h-4 w-4 mr-2" />
              )}
              Simulate Single Account
            </Button>
            
            <Button
              onClick={simulateMultipleAccounts}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Building2 className="h-4 w-4 mr-2" />
              )}
              Simulate Multiple Accounts
            </Button>
          </div>
          
          {hasSimulated && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800 text-sm">
                🎭 <strong>Simulation Mode:</strong> These are simulated bank accounts for development testing. 
                In production, users would connect real bank accounts through Method Connect.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connected Bank Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Bank Accounts</CardTitle>
          <CardDescription>
            {bankAccounts.length === 0 
              ? "No bank accounts connected. Use the simulator above to create test accounts."
              : `${bankAccounts.length} bank account(s) connected`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bankAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bank accounts connected</p>
              <p className="text-sm">Use the simulation buttons above to create test accounts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getAccountTypeIcon(account.type)}
                    <div>
                      <h3 className="font-medium">{account.bank_name}</h3>
                      <p className="text-sm text-gray-600">
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)} ****{account.last_four}
                      </p>
                      {account.routing_number && (
                        <p className="text-xs text-gray-500">
                          Routing: {account.routing_number}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {account.balance && (
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ${(account.balance / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Available</p>
                      </div>
                    )}
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

