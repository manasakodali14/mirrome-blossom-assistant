import { useState } from "react";
import { Heart, Calendar, Droplets, Clipboard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function PeriodTracker() {
  const { toast } = useToast();
  const [periodData, setPeriodData] = useState({
    cycleLength: '28',
    lastPeriodStart: undefined as Date | undefined,
    flowType: '',
    notes: ''
  });

  const handleSave = () => {
    localStorage.setItem('periodData', JSON.stringify(periodData));
    toast({
      title: "Period Data Saved",
      description: "Your cycle information has been saved successfully.",
    });
  };

  const getPredictedNextPeriod = () => {
    if (periodData.lastPeriodStart && periodData.cycleLength) {
      const nextPeriod = addDays(periodData.lastPeriodStart, parseInt(periodData.cycleLength));
      return nextPeriod;
    }
    return null;
  };

  const nextPeriod = getPredictedNextPeriod();

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Period Tracker
          </CardTitle>
          <CardDescription>
            Track your menstrual cycle and predict upcoming periods
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Cycle Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Cycle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cycleLength">Cycle Length (days)</Label>
              <Input
                id="cycleLength"
                type="number"
                value={periodData.cycleLength}
                onChange={(e) => setPeriodData(prev => ({ ...prev, cycleLength: e.target.value }))}
                className="shadow-soft focus:shadow-sakura transition-shadow"
                placeholder="28"
              />
            </div>

            <div className="space-y-2">
              <Label>Last Period Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal shadow-soft focus:shadow-sakura transition-shadow",
                      !periodData.lastPeriodStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {periodData.lastPeriodStart ? format(periodData.lastPeriodStart, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={periodData.lastPeriodStart}
                    onSelect={(date) => setPeriodData(prev => ({ ...prev, lastPeriodStart: date }))}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flow Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Flow Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Flow Type</Label>
            <Select
              value={periodData.flowType}
              onValueChange={(value) => setPeriodData(prev => ({ ...prev, flowType: value }))}
            >
              <SelectTrigger className="shadow-soft focus:shadow-sakura transition-shadow">
                <SelectValue placeholder="Select flow type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
                <SelectItem value="irregular">Irregular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={periodData.notes}
              onChange={(e) => setPeriodData(prev => ({ ...prev, notes: e.target.value }))}
              className="shadow-soft focus:shadow-sakura transition-shadow"
              placeholder="Any symptoms, mood changes, or other notes..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      {nextPeriod && (
        <Card className="shadow-soft bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Next Period Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {format(nextPeriod, "MMMM d, yyyy")}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Based on your {periodData.cycleLength}-day cycle
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <Button 
        onClick={handleSave}
        variant="sakura" 
        className="w-full"
      >
        Save Period Data
      </Button>
    </div>
  );
}