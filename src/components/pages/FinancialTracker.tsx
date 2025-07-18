import { useState } from "react";
import { IndianRupee, Target, Plus, TrendingUp, Calendar, Banknote, PiggyBank, CheckCircle } from "lucide-react";
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
  const [goals, setGoals] = useState([
    { id: 1, title: "Emergency Fund (6 months)", target: 300000, current: 0, completed: false },
    { id: 2, title: "Home Down Payment", target: 500000, current: 0, completed: false },
    { id: 3, title: "Retirement Planning", target: 1000000, current: 0, completed: false },
    { id: 4, title: "Child Education Fund", target: 800000, current: 0, completed: false },
    { id: 5, title: "Vacation Fund", target: 100000, current: 0, completed: false }
  ]);

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
    fees: '',
    utilities: '',
    groceries: '',
    insurance: '',
    mobile: ''
  });

  const [income, setIncome] = useState({
    salary: '',
    otherIncome: '',
    totalSavings: ''
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

  const handleSaveIncome = () => {
    localStorage.setItem('incomeData', JSON.stringify(income));
    toast({
      title: "Income Data Saved",
      description: "Your salary and savings information has been saved.",
    });
  };

  const toggleGoalProgress = (goalId: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const updateGoalProgress = (goalId: number, newAmount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, current: newAmount } : goal
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" />
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

            <div className="space-y-2">
              <Label htmlFor="utilities">Utilities (₹)</Label>
              <Input
                id="utilities"
                type="number"
                value={monthlyDefaults.utilities}
                onChange={(e) => setMonthlyDefaults(prev => ({ ...prev, utilities: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groceries">Groceries (₹)</Label>
              <Input
                id="groceries"
                type="number"
                value={monthlyDefaults.groceries}
                onChange={(e) => setMonthlyDefaults(prev => ({ ...prev, groceries: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance (₹)</Label>
              <Input
                id="insurance"
                type="number"
                value={monthlyDefaults.insurance}
                onChange={(e) => setMonthlyDefaults(prev => ({ ...prev, insurance: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile/Internet (₹)</Label>
              <Input
                id="mobile"
                type="number"
                value={monthlyDefaults.mobile}
                onChange={(e) => setMonthlyDefaults(prev => ({ ...prev, mobile: e.target.value }))}
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

      {/* Income & Savings */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Income & Savings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Salary (₹)</Label>
              <Input
                id="salary"
                type="number"
                value={income.salary}
                onChange={(e) => setIncome(prev => ({ ...prev, salary: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherIncome">Other Income (₹)</Label>
              <Input
                id="otherIncome"
                type="number"
                value={income.otherIncome}
                onChange={(e) => setIncome(prev => ({ ...prev, otherIncome: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalSavings">Total Savings (₹)</Label>
              <Input
                id="totalSavings"
                type="number"
                value={income.totalSavings}
                onChange={(e) => setIncome(prev => ({ ...prev, totalSavings: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="0"
              />
            </div>
          </div>

          <Button onClick={handleSaveIncome} variant="outline" className="w-full">
            <PiggyBank className="h-4 w-4 mr-2" />
            Save Income Data
          </Button>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Financial Goals - {new Date().getFullYear()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg border bg-background">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGoalProgress(goal.id)}
                      className="p-0 h-auto"
                    >
                      <CheckCircle className={`h-5 w-5 ${goal.completed ? 'text-green-600' : 'text-muted-foreground'}`} />
                    </Button>
                    <h4 className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {goal.title}
                    </h4>
                  </div>
                  <Badge variant={goal.completed ? "default" : "secondary"}>
                    ₹{goal.target.toLocaleString()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={goal.current}
                    onChange={(e) => updateGoalProgress(goal.id, parseFloat(e.target.value) || 0)}
                    className="flex-1 h-8 text-sm"
                    placeholder="Current amount"
                  />
                  <span className="text-sm text-muted-foreground">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}