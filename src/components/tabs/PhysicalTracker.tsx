import { useState } from "react";
import { Activity, Heart, Scale, Ruler } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PhysicalTracker() {
  const [physicalData, setPhysicalData] = useState({
    weight: '65',
    height: '165',
    conditions: ['Vitamin D Deficiency'],
    medications: ['Vitamin D3 - 1000 IU daily']
  });

  return (
    <div className="space-y-6 pb-20">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Physical Health Tracker
          </CardTitle>
          <CardDescription>
            Monitor your physical health metrics and conditions
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Basic Metrics */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Basic Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                value={physicalData.weight}
                onChange={(e) => setPhysicalData(prev => ({ ...prev, weight: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                value={physicalData.height}
                onChange={(e) => setPhysicalData(prev => ({ ...prev, height: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Tracker (if Female) */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Period Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Configure your cycle details in the Period Tracker page (☰ Menu)
            </p>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                Next period predicted: Coming soon
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on your cycle data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Conditions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Health Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {physicalData.conditions.map((condition, index) => (
              <Badge key={index} variant="secondary" className="shadow-soft">
                {condition}
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Add Health Condition
          </Button>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Medications & Supplements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {physicalData.medications.map((medication, index) => (
              <div key={index} className="p-3 bg-secondary rounded-lg shadow-soft">
                <p className="text-sm font-medium">{medication}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Add Medication
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}