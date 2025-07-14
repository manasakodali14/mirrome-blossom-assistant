import { useState } from "react";
import { Apple, Coffee, Sun, Moon, Clock, Calendar as CalendarIcon, Plus, FileDown, Droplets, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function FoodTracker() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  const [medicationStatus, setMedicationStatus] = useState({
    breakfast: { taken: false, showAdd: false },
    lunch: { taken: false, showAdd: false },
    dinner: { taken: false, showAdd: false },
    snacks: { taken: false, showAdd: false }
  });

  const [sugarBpData, setSugarBpData] = useState({
    breakfast: { sugar: '', bp: '', showAdd: false },
    lunch: { sugar: '', bp: '', showAdd: false },
    dinner: { sugar: '', bp: '', showAdd: false },
    snacks: { sugar: '', bp: '', showAdd: false }
  });

  const saveFastingData = () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const existing = JSON.parse(localStorage.getItem('fastingData') || '{}');
    existing[dateKey] = fastingData;
    localStorage.setItem('fastingData', JSON.stringify(existing));
    
    toast({
      title: "Fasting Schedule Saved",
      description: `Data saved for ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const saveMealData = () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const existing = JSON.parse(localStorage.getItem('mealData') || '{}');
    existing[dateKey] = {
      meals,
      medications: medicationStatus,
      sugarBp: sugarBpData
    };
    localStorage.setItem('mealData', JSON.stringify(existing));
    
    toast({
      title: "Meal Data Saved",
      description: `All data saved for ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const exportToDoctor = () => {
    toast({
      title: "Export Started",
      description: "Preparing medical report for download...",
    });
    // Export functionality would be implemented here
  };

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: Sun, color: 'text-orange-500' },
    { id: 'lunch', label: 'Lunch', icon: Sun, color: 'text-yellow-500' },
    { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-blue-500' },
    { id: 'snacks', label: 'Snacks', icon: Apple, color: 'text-green-500' }
  ];

  const handleMedicationToggle = (mealId: string, field: string, value: any) => {
    setMedicationStatus(prev => ({
      ...prev,
      [mealId]: {
        ...prev[mealId],
        [field]: value
      }
    }));
  };

  const handleSugarBpChange = (mealId: string, field: string, value: any) => {
    setSugarBpData(prev => ({
      ...prev,
      [mealId]: {
        ...prev[mealId],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            Food Tracker
          </CardTitle>
          <CardDescription>
            Track your meals, medications, and health metrics
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Date Selection */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal shadow-soft",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </CardContent>
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
          <Button 
            variant="sakura" 
            size="sm" 
            onClick={saveFastingData}
            className="w-full"
          >
            Save Fasting Schedule
          </Button>
        </CardContent>
      </Card>

      {/* Meal Sections */}
      {mealTypes.map((mealType) => {
        const Icon = mealType.icon;
        const mealId = mealType.id as keyof typeof medicationStatus;
        
        return (
          <Card key={mealType.id} className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className={`h-5 w-5 ${mealType.color}`} />
                {mealType.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meal Items */}
              <div className="space-y-3">
                {meals[mealId].length === 0 ? (
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

              <Separator />

              {/* Medications Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Medications</Label>
                  <Checkbox
                    checked={medicationStatus[mealId].showAdd}
                    onCheckedChange={(checked) => 
                      handleMedicationToggle(mealId, 'showAdd', checked)
                    }
                  />
                </div>
                
                {medicationStatus[mealId].showAdd && (
                  <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`med-${mealId}`}
                        checked={medicationStatus[mealId].taken}
                        onCheckedChange={(checked) => 
                          handleMedicationToggle(mealId, 'taken', checked)
                        }
                      />
                      <Label htmlFor={`med-${mealId}`} className="text-sm">
                        Medications taken
                      </Label>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Sugar & BP Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Sugar & BP Levels</Label>
                  <Checkbox
                    checked={sugarBpData[mealId].showAdd}
                    onCheckedChange={(checked) => 
                      handleSugarBpChange(mealId, 'showAdd', checked)
                    }
                  />
                </div>
                
                {sugarBpData[mealId].showAdd && (
                  <div className="space-y-3 p-3 bg-secondary/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          Sugar (mg/dL)
                        </Label>
                        <Input
                          type="number"
                          placeholder="120"
                          value={sugarBpData[mealId].sugar}
                          onChange={(e) => handleSugarBpChange(mealId, 'sugar', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          BP (mmHg)
                        </Label>
                        <Input
                          placeholder="120/80"
                          value={sugarBpData[mealId].bp}
                          onChange={(e) => handleSugarBpChange(mealId, 'bp', e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Export & Save Actions */}
      <Card className="shadow-soft bg-primary/5 border-primary/20">
        <CardContent className="p-4 space-y-3">
          <Button onClick={saveMealData} variant="sakura" className="w-full">
            Save All Data
          </Button>
          <Button onClick={exportToDoctor} variant="outline" className="w-full">
            <FileDown className="h-4 w-4 mr-2" />
            Export to Doctor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}