
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Download, Users, MapPin, Calendar } from 'lucide-react';

interface BudgetItem {
  category: string;
  percentage: string;
  amount: number;
  perPerson: number;
  notes: string;
  enabled: boolean;
}

const BudgetCalculator = () => {
  const [budgetData, setBudgetData] = useState({
    teamSize: 20,
    days: 3,
    location: 'Cape Town, South Africa',
    retreatType: 'Half Fun, Half Work'
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      category: 'Transportation',
      percentage: '15-25%',
      amount: 55500,
      perPerson: 0,
      notes: 'Flights, transfers, shuttles',
      enabled: true
    },
    {
      category: 'Accommodation',
      percentage: '25-35%',
      amount: 92500,
      perPerson: 0,
      notes: 'Individual rooms, meeting spaces',
      enabled: true
    },
    {
      category: 'Food & Beverage',
      percentage: '20-30%',
      amount: 74000,
      perPerson: 0,
      notes: 'All meals, dietary restrictions',
      enabled: true
    },
    {
      category: 'Activities & Programming',
      percentage: '15-25%',
      amount: 55500,
      perPerson: 0,
      notes: 'Team building, workshops, entertainment',
      enabled: true
    },
    {
      category: 'Meeting Space',
      percentage: '3-5%',
      amount: 18500,
      perPerson: 0,
      notes: 'Conference rooms, AV equipment',
      enabled: true
    },
    {
      category: 'Contingency',
      percentage: '10-15%',
      amount: 27750,
      perPerson: 0,
      notes: 'Emergency fund for unexpected costs',
      enabled: true
    }
  ]);

  const updateBudgetData = (key: string, value: any) => {
    setBudgetData(prev => ({ ...prev, [key]: value }));
  };

  const updateBudgetItem = (index: number, amount: number) => {
    setBudgetItems(prev => 
      prev.map((item, i) => 
        i === index 
          ? { ...item, amount, perPerson: amount / budgetData.teamSize }
          : item
      )
    );
  };

  const toggleBudgetItem = (index: number) => {
    setBudgetItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const totalBudget = budgetItems
    .filter(item => item.enabled)
    .reduce((sum, item) => sum + item.amount, 0);

  const perPersonCost = totalBudget / budgetData.teamSize;

  const downloadCSV = () => {
    const csvData = [
      ['Category', 'Amount (ZAR)', 'Per Person (ZAR)', 'Notes'],
      ...budgetItems
        .filter(item => item.enabled)
        .map(item => [
          item.category,
          item.amount.toString(),
          (item.amount / budgetData.teamSize).toFixed(0),
          item.notes
        ]),
      ['Total', totalBudget.toString(), perPersonCost.toFixed(0), '']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'retreat-budget-estimate.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calculator className="h-6 w-6 text-bantu-orange" />
          Interactive Budget Calculator
        </CardTitle>
        <p className="text-gray-600">
          This budget estimator simplifies forecasting by providing cost data from past events, 
          including all taxes and hidden fees, to prevent surprises.
        </p>
      </CardHeader>
      <CardContent>
        {/* Basic Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Select value={budgetData.location} onValueChange={(value) => updateBudgetData('location', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cape Town, South Africa">Cape Town, South Africa</SelectItem>
                <SelectItem value="Johannesburg, South Africa">Johannesburg, South Africa</SelectItem>
                <SelectItem value="Durban, South Africa">Durban, South Africa</SelectItem>
                <SelectItem value="Luanda, Angola">Luanda, Angola</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Retreat Type</label>
            <Select value={budgetData.retreatType} onValueChange={(value) => updateBudgetData('retreatType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Half Fun, Half Work">Half Fun, Half Work</SelectItem>
                <SelectItem value="Work Focused">Work Focused</SelectItem>
                <SelectItem value="Team Building">Team Building</SelectItem>
                <SelectItem value="Strategic Planning">Strategic Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Number of Days
            </label>
            <Input
              type="number"
              value={budgetData.days}
              onChange={(e) => updateBudgetData('days', parseInt(e.target.value) || 0)}
              min="1"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Number of People
            </label>
            <Input
              type="number"
              value={budgetData.teamSize}
              onChange={(e) => updateBudgetData('teamSize', parseInt(e.target.value) || 0)}
              min="1"
              max="100"
            />
          </div>
        </div>

        {/* Budget Summary Card */}
        <div className="bg-gradient-to-r from-bantu-orange to-bantu-yellow text-white p-6 rounded-lg mb-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">{budgetData.location}</h3>
            <div className="text-4xl font-bold mb-2">
              R{totalBudget.toLocaleString('en-ZA')}
            </div>
            <div className="text-lg opacity-90">
              R{perPersonCost.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} per person
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">{budgetData.retreatType}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">{budgetData.days} days</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">{budgetData.teamSize} people</span>
            </div>
          </div>
        </div>

        {/* Budget Items */}
        <div className="space-y-4">
          {budgetItems.map((item, index) => (
            <div 
              key={index}
              className={`p-4 border rounded-lg transition-all ${
                item.enabled ? 'border-bantu-orange/30 bg-white' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => toggleBudgetItem(index)}
                  className="w-5 h-5 text-bantu-orange border-gray-300 rounded focus:ring-bantu-orange"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <div className="font-medium">{item.category}</div>
                    <div className="text-sm text-gray-500">{item.percentage}</div>
                  </div>
                  <div>
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateBudgetItem(index, parseFloat(e.target.value) || 0)}
                      disabled={!item.enabled}
                      className="text-right"
                    />
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      R{(item.amount / budgetData.teamSize).toLocaleString('en-ZA', { 
                        minimumFractionDigits: 0, 
                        maximumFractionDigits: 0 
                      })}
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                  <div className="text-sm text-gray-600">{item.notes}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Download Button */}
        <div className="mt-6 text-center">
          <Button onClick={downloadCSV} className="bg-bantu-orange hover:bg-bantu-orange/90">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCalculator;
