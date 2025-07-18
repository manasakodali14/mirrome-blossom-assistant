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

  const takenCount = medications.filter(med => med.taken).length;

  return (
    <Card className={`shadow-soft ${bgGradient} border border-border/50`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
          {takenCount > 0 && (
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 border-green-200">
              {takenCount} medication{takenCount > 1 ? 's' : ''} taken
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Food Items */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Food Items
          </Label>
          <Textarea
            value={food}
            onChange={(e) => onFoodChange(e.target.value)}
            placeholder={`What did you have for ${title.toLowerCase()}?`}
            className="min-h-[80px] shadow-soft focus:shadow-sakura transition-shadow resize-none"
            rows={3}
          />
        </div>

        {/* Medications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">
              Medications & Supplements
            </Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {medications.filter(med => med.taken).length}/{medications.length}
              </Badge>
              <Button
                onClick={() => setShowAddMed(!showAddMed)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {medications.length > 0 && (
            <>
              <div className="text-xs text-muted-foreground mb-2">
                ✨ From Medication Manager - Update medicines in Medication Manager
              </div>
              <div className="space-y-2">
                {medications.map((medication, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-accent/50 transition-all duration-200 animate-fade-in"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${medication.taken ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                      <span className={`text-sm ${medication.taken ? 'text-green-700 font-medium' : 'text-foreground'}`}>
                        {medication.name}
                      </span>
                      {medication.taken && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                          ✓ Taken
                        </Badge>
                      )}
                    </div>
                    <Checkbox
                      checked={medication.taken}
                      onCheckedChange={() => onMedicationToggle(index)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 transition-all duration-200 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {showAddMed && (
            <div className="space-y-2 p-3 rounded-lg bg-accent/30 border border-primary/20">
              <div className="text-xs text-muted-foreground">
                💊 Add specific medication for today only
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="e.g., Paracetamol 500mg"
                  className="flex-1 h-8 text-sm shadow-soft focus:shadow-sakura transition-shadow"
                />
                <Button
                  onClick={handleAddMedication}
                  size="sm"
                  className="h-8 hover:shadow-sakura transition-shadow"
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {medications.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Pill className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No medications from Medication Manager</p>
              <p className="text-xs">Add medicines in Medication Manager to see them here</p>
            </div>
          )}
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Blood Sugar
            </Label>
            <Input
              type="number"
              value={sugar || ''}
              onChange={(e) => onSugarChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="mg/dL"
              className="shadow-soft focus:shadow-sakura transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Blood Pressure
            </Label>
            <Input
              value={bp || ''}
              onChange={(e) => onBPChange(e.target.value)}
              placeholder="120/80"
              className="shadow-soft focus:shadow-sakura transition-shadow"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}