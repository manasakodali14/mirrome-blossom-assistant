import { useState } from "react";
import { Apple, Coffee, Sun, Moon, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FoodTracker() {
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });

  const [fastingData, setFastingData] = useState({
    startTime: '',
    endTime: ''
  });

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: Sun, color: 'text-orange-500' },
    { id: 'lunch', label: 'Lunch', icon: Sun, color: 'text-yellow-500' },
    { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-blue-500' },
    { id: 'snacks', label: 'Snacks', icon: Apple, color: 'text-green-500' }
  ];

  return (
    <div className="space-y-6 pb-20">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            Food Tracker
          </CardTitle>
          <CardDescription>
            Track your meals and intermittent fasting schedule
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Intermittent Fasting */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Intermittent Fasting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={fastingData.startTime}
                onChange={(e) => setFastingData(prev => ({ ...prev, startTime: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={fastingData.endTime}
                onChange={(e) => setFastingData(prev => ({ ...prev, endTime: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Sections */}
      {mealTypes.map((mealType) => {
        const Icon = mealType.icon;
        return (
          <Card key={mealType.id} className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className={`h-5 w-5 ${mealType.color}`} />
                {mealType.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meals[mealType.id as keyof typeof meals].length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No {mealType.label.toLowerCase()} added yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {/* Meal items would be rendered here */}
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full">
                  Add {mealType.label}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Quick Actions */}
      <Card className="shadow-soft bg-secondary/50">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <Coffee className="h-8 w-8 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              "Did you take any medications? Add now?"
            </p>
            <Button variant="sakura" size="sm">
              Add Medications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}