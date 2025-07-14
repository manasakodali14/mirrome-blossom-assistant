import { useState } from "react";
import { DollarSign, Target, Plus, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function FinancialTracker() {
  const { toast } = useToast();
  const [goals, setGoals] = useState({
    shortTerm: [],
    longTerm: []
  });

  const [expense, setExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [monthlyDefaults, setMonthlyDefaults] = useState({
    emi: '',
    rent: '',
    sip: '',
    fees: ''
  });

  const expenseCategories = [
    'Food',
    'Transport', 
    'Entertainment',
    'Bills',
    'Health',
    'Shopping',
    'Education',
    'Miscellaneous'
  ];

  const handleSaveExpense = () => {
    if (!expense.amount || !expense.category) return;
    
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    expenses.push({
      ...expense,
      id: Date.now(),
      amount: parseFloat(expense.amount)
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    setExpense({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Expense Added",
      description: `₹${expense.amount} expense recorded successfully.`,
    });
  };

  const handleSaveDefaults = () => {
    localStorage.setItem('monthlyDefaults', JSON.stringify(monthlyDefaults));
    toast({
      title: "Monthly Defaults Saved",
      description: "Your monthly expenses have been saved.",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Financial Tracker
          </CardTitle>
          <CardDescription>
            Manage your expenses, goals, and monthly commitments (₹)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Daily Expense Entry */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add Daily Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={expense.amount}
                onChange={(e) => setExpense(prev => ({ ...prev, amount: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={expense.category}
                onValueChange={(value) => setExpense(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="shadow-soft focus:shadow-sakura transition-shadow">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={expense.date}
              onChange={(e) => setExpense(prev => ({ ...prev, date: e.target.value }))}
              className="shadow-soft focus:shadow-sakura transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={expense.description}
              onChange={(e) => setExpense(prev => ({ ...prev, description: e.target.value }))}
              className="shadow-soft focus:shadow-sakura transition-shadow"
              placeholder="What was this expense for?"
            />
          </div>

          <Button onClick={handleSaveExpense} variant="sakura" className="w-full">
            Save Expense
          </Button>
        </CardContent>
      </Card>

      {/* Monthly Defaults */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Monthly Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emi">EMI (₹)</Label>
              <Input
                id="emi"
                type="number"
                value={monthlyDefaults.emi}
                onChange={(e) => setMonthlyDefaults(prev => ({ ...prev, emi: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rent">Rent (₹)</Label>
              <Input
                id="rent"
                type="number"
                value={monthlyDefaults.rent}
                onChange={(e) => setMonthlyDefaults(prev => ({ ...prev, rent: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sip">SIP (₹)</Label>
              <Input
                id="sip"
                type="number"
                value={monthlyDefaults.sip}
                onChange={(e) => setMonthlyDefaults(prev => ({ ...prev, sip: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees (₹)</Label>
              <Input
                id="fees"
                type="number"
                value={monthlyDefaults.fees}
                onChange={(e) => setMonthlyDefaults(prev => ({ ...prev, fees: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>
          </div>

          <Button onClick={handleSaveDefaults} variant="outline" className="w-full">
            Save Monthly Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Financial Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Goal tracking feature coming soon!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}