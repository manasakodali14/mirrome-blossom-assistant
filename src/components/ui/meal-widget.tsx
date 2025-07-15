import { useState } from "react";
import { Plus, Pill, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface MealWidgetProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  icon: React.ComponentType<any>;
  title: string;
  bgGradient: string;
  food: string;
  medications: Array<{name: string; taken: boolean}>;
  sugar?: number;
  bp?: string;
  onFoodChange: (value: string) => void;
  onMedicationToggle: (index: number) => void;
  onSugarChange: (value: number | undefined) => void;
  onBPChange: (value: string) => void;
  onAddMedication: (name: string) => void;
}

export function MealWidget({
  mealType,
  icon: Icon,
  title,
  bgGradient,
  food,
  medications,
  sugar,
  bp,
  onFoodChange,
  onMedicationToggle,
  onSugarChange,
  onBPChange,
  onAddMedication
}: MealWidgetProps) {
  const [newMedication, setNewMedication] = useState('');
  const [showAddMed, setShowAddMed] = useState(false);

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      onAddMedication(newMedication.trim());
      setNewMedication('');
      setShowAddMed(false);
    }
  };

  const getMealTime = () => {
    switch (mealType) {
      case 'breakfast': return '7:00 - 10:00 AM';
      case 'lunch': return '12:00 - 2:00 PM';
      case 'dinner': return '7:00 - 9:00 PM';
      case 'snacks': return 'Anytime';
    }
  };

  return (
    <Card className={`shadow-soft ${bgGradient}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
          <Badge variant="secondary" className="ml-auto text-xs">
            {getMealTime()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Food Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">What did you eat?</Label>
          <Textarea
            value={food}
            onChange={(e) => onFoodChange(e.target.value)}
            placeholder={`Enter your ${mealType} details...`}
            className="min-h-20 resize-none"
          />
        </div>

        {/* Medications Section */}
        {medications.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Medications
            </Label>
            <div className="space-y-2">
              {medications.map((med, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-background/50 rounded-lg">
                  <Checkbox
                    checked={med.taken}
                    onCheckedChange={() => onMedicationToggle(index)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className={`flex-1 text-sm ${med.taken ? 'line-through text-muted-foreground' : ''}`}>
                    {med.name}
                  </span>
                  {med.taken && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Taken
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Medication */}
        <div className="space-y-2">
          {!showAddMed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddMed(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Medication name"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
              />
              <Button size="sm" onClick={handleAddMedication}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddMed(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Sugar Level
            </Label>
            <Input
              type="number"
              value={sugar || ''}
              onChange={(e) => onSugarChange(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="mg/dL"
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Blood Pressure
            </Label>
            <Input
              value={bp}
              onChange={(e) => onBPChange(e.target.value)}
              placeholder="120/80"
              className="text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}