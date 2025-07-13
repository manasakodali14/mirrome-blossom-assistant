import { BarChart3, Trophy, TrendingUp, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function ReviewDashboard() {
  // Mock data for demonstration
  const todayScore = 85;
  const weeklyAverage = 78;
  
  const metrics = [
    { label: 'Tasks Completed', value: 8, total: 10, percentage: 80 },
    { label: 'Meals Logged', value: 3, total: 3, percentage: 100 },
    { label: 'Diary Entry', value: 1, total: 1, percentage: 100 },
    { label: 'Health Metrics', value: 2, total: 3, percentage: 67 }
  ];

  const appreciationMessages = [
    "Great job today, keep it up! 🌸",
    "You're doing wonderfully! 💖",
    "Your consistency is inspiring! ✨",
    "Beautiful progress today! 🌺"
  ];

  const randomMessage = appreciationMessages[Math.floor(Math.random() * appreciationMessages.length)];

  return (
    <div className="space-y-6 pb-20">
      <Card className="bg-gradient-sakura text-primary-foreground shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Daily Review
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Your beautiful progress summary
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Today's Score */}
      <Card className="shadow-sakura bg-gradient-rose">
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 text-primary mx-auto mb-4 animate-gentle-bounce" />
          <div className="text-4xl font-bold text-primary mb-2">{todayScore}%</div>
          <p className="text-lg font-semibold mb-1">Today's Score</p>
          <p className="text-sm text-muted-foreground">{randomMessage}</p>
        </CardContent>
      </Card>

      {/* Progress Breakdown */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progress Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{metric.label}</span>
                <Badge variant="secondary" className="shadow-soft">
                  {metric.value}/{metric.total}
                </Badge>
              </div>
              <Progress value={metric.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Comparison */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{weeklyAverage}%</p>
              <p className="text-sm text-muted-foreground">This week's average</p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                todayScore > weeklyAverage ? 'text-green-600' : 'text-orange-600'
              }`}>
                {todayScore > weeklyAverage ? '+' : ''}{todayScore - weeklyAverage}%
              </div>
              <p className="text-xs text-muted-foreground">vs today</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation Card */}
      <Card className="shadow-soft bg-gradient-soft">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Keep Blooming! 🌸</h3>
          <p className="text-sm text-muted-foreground">
            Every small step you take is progress. You're doing amazingly well!
          </p>
        </CardContent>
      </Card>

      {/* Charts Placeholder */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Visual Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Beautiful charts and visualizations coming soon! 📊✨
          </p>
        </CardContent>
      </Card>
    </div>
  );
}