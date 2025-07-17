import { useState, useEffect } from "react";
import { Pill, Plus, Trash2, Clock, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { dataService, Medication } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";

export function MedicationManager() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    mealType: '',
    timing: '',
    notes: ''
  });
  const { toast } = useToast();

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'other', label: 'Other/Anytime' }
  ];

  const timingOptions = [
    { value: 'before', label: 'Before Meal' },
    { value: 'after', label: 'After Meal' },
    { value: 'with', label: 'With Meal' },
    { value: 'independent', label: 'Independent of Meal' }
  ];

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = () => {
    const savedMedications = dataService.getMedications();
    setMedications(savedMedications);
  };

  const addMedication = () => {
    if (!newMedication.name.trim() || !newMedication.mealType) {
      toast({
        title: "Missing information",
        description: "Please fill in medication name and meal type",
        variant: "destructive"
      });
      return;
    }

    const medication: Medication = {
      id: `med_${Date.now()}_${Math.random()}`,
      name: newMedication.name.trim(),
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      mealType: newMedication.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'other',
      timing: newMedication.timing as 'before' | 'after' | 'with' | 'independent',
      notes: newMedication.notes,
      isActive: true
    };

    const updatedMedications = [...medications, medication];
    setMedications(updatedMedications);
    dataService.saveMedications(updatedMedications);

    // Reset form
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      mealType: '',
      timing: '',
      notes: ''
    });

    toast({
      title: "Medication added! 💊",
      description: "Your medication has been saved to the manager",
    });
  };

  const removeMedication = (id: string) => {
    const updatedMedications = medications.filter(med => med.id !== id);
    setMedications(updatedMedications);
    dataService.saveMedications(updatedMedications);

    toast({
      title: "Medication removed",
      description: "The medication has been deleted from your list",
    });
  };

  const toggleMedicationStatus = (id: string) => {
    const updatedMedications = medications.map(med =>
      med.id === id ? { ...med, isActive: !med.isActive } : med
    );
    setMedications(updatedMedications);
    dataService.saveMedications(updatedMedications);
  };

  const getMedicationsByMealType = (mealType: string) => {
    return medications.filter(med => med.mealType === mealType && med.isActive);
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Medication Manager
          </CardTitle>
          <CardDescription>
            Manage your medications and supplements by meal timing 💊
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Add New Medication */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Medication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medName">Medication Name</Label>
              <Input
                id="medName"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Vitamin D3, Metformin"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 500mg, 1 tablet"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select
                value={newMedication.mealType}
                onValueChange={(value) => setNewMedication(prev => ({ ...prev, mealType: value }))}
              >
                <SelectTrigger className="shadow-soft focus:shadow-sakura transition-shadow">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timing</Label>
              <Select
                value={newMedication.timing}
                onValueChange={(value) => setNewMedication(prev => ({ ...prev, timing: value }))}
              >
                <SelectTrigger className="shadow-soft focus:shadow-sakura transition-shadow">
                  <SelectValue placeholder="Select timing" />
                </SelectTrigger>
                <SelectContent>
                  {timingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                placeholder="e.g., Once daily, Twice daily"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={newMedication.notes}
              onChange={(e) => setNewMedication(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special instructions or notes..."
              className="shadow-soft focus:shadow-sakura transition-shadow"
              rows={3}
            />
          </div>

          <Button 
            onClick={addMedication}
            variant="sakura" 
            className="w-full"
            disabled={!newMedication.name.trim() || !newMedication.mealType}
          >
            <Save className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </CardContent>
      </Card>

      {/* Medications by Meal Type */}
      {mealTypes.map((mealType) => {
        const mealMedications = getMedicationsByMealType(mealType.value);
        
        return (
          <Card key={mealType.value} className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {mealType.label} Medications
                <Badge variant="secondary" className="ml-auto">
                  {mealMedications.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mealMedications.length === 0 ? (
                <div className="text-center py-6">
                  <Pill className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No medications for {mealType.label.toLowerCase()}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mealMedications.map((medication) => (
                    <div
                      key={medication.id}
                      className="p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{medication.name}</h4>
                            {medication.dosage && (
                              <Badge variant="outline" className="text-xs">
                                {medication.dosage}
                              </Badge>
                            )}
                            {medication.timing && (
                              <Badge variant="secondary" className="text-xs">
                                {timingOptions.find(opt => opt.value === medication.timing)?.label}
                              </Badge>
                            )}
                          </div>
                          
                          {medication.frequency && (
                            <p className="text-sm text-muted-foreground mb-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {medication.frequency}
                            </p>
                          )}
                          
                          {medication.notes && (
                            <p className="text-sm text-muted-foreground">
                              {medication.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMedicationStatus(medication.id)}
                            className={medication.isActive ? "text-green-600" : "text-muted-foreground"}
                          >
                            {medication.isActive ? "Active" : "Inactive"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMedication(medication.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Summary */}
      <Card className="shadow-soft bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium">
              Total Active Medications: {medications.filter(med => med.isActive).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              These medications will automatically appear in your Food Tracker
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}