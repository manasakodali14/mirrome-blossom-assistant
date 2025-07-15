import { useState, useEffect } from "react";
import { UtensilsCrossed, Coffee, Sandwich, Pizza, Cookie, Clock, Plus, Pill, Calendar, ChevronLeft, ChevronRight, Save, FileText, Activity, Droplets } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dataService, FoodEntry, Medication } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";
import { MealWidget } from "@/components/ui/meal-widget";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function FoodTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foodData, setFoodData] = useState<FoodEntry>({
    id: '',
    date: '',
    breakfast: { food: '', medications: [], sugar: undefined, bp: '' },
    lunch: { food: '', medications: [], sugar: undefined, bp: '' },
    dinner: { food: '', medications: [], sugar: undefined, bp: '' },
    snacks: { food: '', medications: [], sugar: undefined, bp: '' },
    intermittentFasting: { startTime: '', endTime: '' }
  });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    loadMedications();
  }, []);

  useEffect(() => {
    loadFoodData();
  }, [selectedDate, medications]);

  const loadMedications = () => {
    const savedMeds = dataService.getMedications();
    setMedications(savedMeds);
  };

  const loadFoodData = () => {
    const dateStr = dataService.formatDate(selectedDate);
    const savedData = dataService.getFoodEntry(dateStr);
    
    if (savedData) {
      setFoodData(savedData);
    } else {
      // Initialize with medications from manager
      const mealMeds = {
        breakfast: medications.filter(m => m.mealType === 'breakfast').map(m => ({ name: m.name, taken: false })),
        lunch: medications.filter(m => m.mealType === 'lunch').map(m => ({ name: m.name, taken: false })),
        dinner: medications.filter(m => m.mealType === 'dinner').map(m => ({ name: m.name, taken: false })),
        snacks: medications.filter(m => m.mealType === 'snacks').map(m => ({ name: m.name, taken: false }))
      };

      setFoodData({
        id: dateStr,
        date: dateStr,
        breakfast: { food: '', medications: mealMeds.breakfast, sugar: undefined, bp: '' },
        lunch: { food: '', medications: mealMeds.lunch, sugar: undefined, bp: '' },
        dinner: { food: '', medications: mealMeds.dinner, sugar: undefined, bp: '' },
        snacks: { food: '', medications: mealMeds.snacks, sugar: undefined, bp: '' },
        intermittentFasting: { startTime: '', endTime: '' }
      });
    }
  };

  const validateFasting = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (foodData.intermittentFasting.startTime && foodData.intermittentFasting.endTime) {
      const start = new Date(`2000-01-01 ${foodData.intermittentFasting.startTime}`);
      const end = new Date(`2000-01-01 ${foodData.intermittentFasting.endTime}`);
      
      if (end <= start) {
        newErrors.fasting = "End time must be after start time";
      }
    } else if (foodData.intermittentFasting.startTime && !foodData.intermittentFasting.endTime) {
      newErrors.fasting = "Please enter end time";
    } else if (!foodData.intermittentFasting.startTime && foodData.intermittentFasting.endTime) {
      newErrors.fasting = "Please enter start time";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAllData = () => {
    if (!validateFasting()) return;
    
    const dateStr = dataService.formatDate(selectedDate);
    const dataToSave = { ...foodData, id: dateStr, date: dateStr };
    
    dataService.saveFoodEntry(dateStr, dataToSave);
    toast({
      title: "Food data saved! 🍽️",
      description: "Your meal and health information has been recorded",
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const updateMealData = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks', field: string, value: any) => {
    setFoodData(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: value
      }
    }));
  };

  const toggleMedication = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks', medIndex: number) => {
    setFoodData(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        medications: prev[meal].medications.map((med, index) => 
          index === medIndex ? { ...med, taken: !med.taken } : med
        )
      }
    }));
  };

  const addCustomMedication = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks', medName: string) => {
    if (!medName.trim()) return;
    
    setFoodData(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        medications: [...prev[meal].medications, { name: medName, taken: false }]
      }
    }));
  };

  const exportToDoctor = () => {
    toast({
      title: "Export functionality",
      description: "PDF export will be implemented soon",
    });
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6 pb-20">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            Food Tracker
          </CardTitle>
          <CardDescription>
            Track your meals, medications, and health metrics 🌸
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Date Navigation */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate('prev')}
              className="hover:shadow-sakura"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "min-w-[200px] justify-center text-center font-medium shadow-soft hover:shadow-sakura",
                      isToday() && "bg-primary/10 border-primary/30"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(selectedDate, "EEE, MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComp
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {isToday() && <Badge variant="secondary">Today</Badge>}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate('next')}
              className="hover:shadow-sakura"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
                value={foodData.intermittentFasting.startTime}
                onChange={(e) => setFoodData(prev => ({ 
                  ...prev, 
                  intermittentFasting: { ...prev.intermittentFasting, startTime: e.target.value }
                }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={foodData.intermittentFasting.endTime}
                onChange={(e) => setFoodData(prev => ({ 
                  ...prev, 
                  intermittentFasting: { ...prev.intermittentFasting, endTime: e.target.value }
                }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
          </div>
          {errors.fasting && (
            <p className="text-sm text-destructive">{errors.fasting}</p>
          )}
        </CardContent>
      </Card>

      {/* Meal Widgets */}
      <MealWidget
        mealType="breakfast"
        icon={Coffee}
        title="Breakfast"
        bgGradient="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30"
        food={foodData.breakfast.food}
        medications={foodData.breakfast.medications}
        sugar={foodData.breakfast.sugar}
        bp={foodData.breakfast.bp}
        onFoodChange={(value) => updateMealData('breakfast', 'food', value)}
        onMedicationToggle={(index) => toggleMedication('breakfast', index)}
        onSugarChange={(value) => updateMealData('breakfast', 'sugar', value)}
        onBPChange={(value) => updateMealData('breakfast', 'bp', value)}
        onAddMedication={(name) => addCustomMedication('breakfast', name)}
      />

      <MealWidget
        mealType="lunch"
        icon={Sandwich}
        title="Lunch"
        bgGradient="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30"
        food={foodData.lunch.food}
        medications={foodData.lunch.medications}
        sugar={foodData.lunch.sugar}
        bp={foodData.lunch.bp}
        onFoodChange={(value) => updateMealData('lunch', 'food', value)}
        onMedicationToggle={(index) => toggleMedication('lunch', index)}
        onSugarChange={(value) => updateMealData('lunch', 'sugar', value)}
        onBPChange={(value) => updateMealData('lunch', 'bp', value)}
        onAddMedication={(name) => addCustomMedication('lunch', name)}
      />

      <MealWidget
        mealType="dinner"
        icon={Pizza}
        title="Dinner"
        bgGradient="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30"
        food={foodData.dinner.food}
        medications={foodData.dinner.medications}
        sugar={foodData.dinner.sugar}
        bp={foodData.dinner.bp}
        onFoodChange={(value) => updateMealData('dinner', 'food', value)}
        onMedicationToggle={(index) => toggleMedication('dinner', index)}
        onSugarChange={(value) => updateMealData('dinner', 'sugar', value)}
        onBPChange={(value) => updateMealData('dinner', 'bp', value)}
        onAddMedication={(name) => addCustomMedication('dinner', name)}
      />

      <MealWidget
        mealType="snacks"
        icon={Cookie}
        title="Snacks"
        bgGradient="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30"
        food={foodData.snacks.food}
        medications={foodData.snacks.medications}
        sugar={foodData.snacks.sugar}
        bp={foodData.snacks.bp}
        onFoodChange={(value) => updateMealData('snacks', 'food', value)}
        onMedicationToggle={(index) => toggleMedication('snacks', index)}
        onSugarChange={(value) => updateMealData('snacks', 'sugar', value)}
        onBPChange={(value) => updateMealData('snacks', 'bp', value)}
        onAddMedication={(name) => addCustomMedication('snacks', name)}
      />

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={saveAllData}
          variant="sakura" 
          className="w-full shadow-sakura hover:shadow-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Data
        </Button>
        
        <Button 
          onClick={exportToDoctor}
          variant="outline" 
          className="w-full shadow-soft hover:shadow-sakura"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export to Doctor
        </Button>
      </div>
    </div>
  );
}