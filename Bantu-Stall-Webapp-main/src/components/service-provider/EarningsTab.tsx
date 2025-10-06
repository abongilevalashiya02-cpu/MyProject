
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DollarSign,
  Download,
  TrendingUp,
  Calendar,
  CreditCard,
  Clock,
  FileText,
} from 'lucide-react';

export const EarningsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Earnings & Payouts</h1>
        <div className="flex gap-2">
          <Select defaultValue="mar2025">
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mar2025">March 2025</SelectItem>
              <SelectItem value="feb2025">February 2025</SelectItem>
              <SelectItem value="jan2025">January 2025</SelectItem>
              <SelectItem value="q1_2025">Q1 2025</SelectItem>
              <SelectItem value="2025">Year 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-1" />
              <CardTitle className="text-2xl">$8,245.00</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Up 12% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available for Withdrawal</CardDescription>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-blue-500 mr-1" />
              <CardTitle className="text-2xl">$3,120.50</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="mt-1">
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next Payout</CardDescription>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-500 mr-1" />
              <CardTitle className="text-lg">April 15, 2025</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              $1,250.00 scheduled
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your booking earnings and platform fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "TRX-3928",
                    type: "booking",
                    description: "Cultural Heritage Tour Booking",
                    date: "Apr 1, 2025",
                    amount: "+$180.00",
                    status: "Completed"
                  },
                  {
                    id: "TRX-3924",
                    type: "booking",
                    description: "Cooking Class Booking",
                    date: "Mar 28, 2025",
                    amount: "+$320.00",
                    status: "Completed"
                  },
                  {
                    id: "TRX-3918",
                    type: "fee",
                    description: "Platform Service Fee",
                    date: "Mar 28, 2025",
                    amount: "-$16.00",
                    status: "Processed"
                  },
                  {
                    id: "TRX-3912",
                    type: "booking",
                    description: "Private City Tour",
                    date: "Mar 25, 2025",
                    amount: "+$120.00",
                    status: "Completed"
                  },
                  {
                    id: "TRX-3905",
                    type: "payout",
                    description: "Bank Account Withdrawal",
                    date: "Mar 15, 2025",
                    amount: "-$650.00",
                    status: "Processed"
                  }
                ].map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-start space-x-3">
                      <div className={`rounded-full p-2 ${
                        transaction.type === "booking" ? "bg-green-100" : 
                        transaction.type === "payout" ? "bg-blue-100" : "bg-orange-100"
                      }`}>
                        {transaction.type === "booking" ? (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        ) : transaction.type === "payout" ? (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {transaction.amount}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">View All Transactions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout Methods</CardTitle>
              <CardDescription>Manage your payout preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md border-2 border-blue-500">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-md mr-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Bank Account (Primary)</div>
                        <div className="text-sm text-gray-500">Ending in •••• 5678</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                
                <Button className="w-full">Add Payout Method</Button>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Recent Payouts</h3>
                <div className="space-y-3">
                  {[
                    {
                      date: "Mar 15, 2025",
                      amount: "$650.00",
                      status: "Completed",
                      method: "Bank Account"
                    },
                    {
                      date: "Feb 15, 2025",
                      amount: "$880.00",
                      status: "Completed",
                      method: "Bank Account"
                    },
                    {
                      date: "Jan 15, 2025",
                      amount: "$720.00",
                      status: "Completed",
                      method: "Bank Account"
                    }
                  ].map((payout, index) => (
                    <div key={index} className="grid grid-cols-4 p-3 bg-gray-50 rounded-md">
                      <div className="text-gray-600">{payout.date}</div>
                      <div className="font-medium">{payout.amount}</div>
                      <div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          {payout.status}
                        </Badge>
                      </div>
                      <div className="text-right text-sm text-gray-600">{payout.method}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Analytics</CardTitle>
              <CardDescription>Track your performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded border mb-6">
                <p className="text-gray-500">Earnings chart will appear here</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <div className="text-sm text-gray-500 mb-1">Top Experience</div>
                  <div className="font-medium">Cultural Heritage Tour</div>
                  <div className="text-sm text-green-600">$2,340 total</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <div className="text-sm text-gray-500 mb-1">Best Month</div>
                  <div className="font-medium">March 2025</div>
                  <div className="text-sm text-green-600">$3,120 earned</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <div className="text-sm text-gray-500 mb-1">Growth</div>
                  <div className="font-medium">+22% Year over Year</div>
                  <div className="text-sm text-blue-600">Above platform average</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Earnings Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
