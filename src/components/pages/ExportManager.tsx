import { useState } from "react";
import { FileText, Download, Mail, Calendar, User, Activity, Pill, Utensils } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dataService } from "@/lib/dataService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function ExportManager() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    medicalConditions: '',
    email: ''
  });
  const { toast } = useToast();

  const exportToPDF = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date Range Required",
        description: "Please select both start and end dates",
        variant: "destructive"
      });
      return;
    }

    // Generate PDF with all food data for the date range
    const exportData = {
      userInfo,
      dateRange: { start: startDate, end: endDate },
      foodData: [], // Will be populated with actual data
      medications: dataService.getMedications()
    };

    toast({
      title: "PDF Export",
      description: "PDF generation will be implemented with proper library",
    });
  };

  const exportToGmail = () => {
    if (!userInfo.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    const mailtoLink = `mailto:${userInfo.email}?subject=Mirrome Health Export&body=Your health data export is attached.`;
    window.open(mailtoLink);
  };

  const downloadToDevice = () => {
    const data = {
      exportDate: new Date().toISOString(),
      userInfo,
      dateRange: startDate && endDate ? { start: startDate, end: endDate } : null,
      // Add all relevant data here
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mirrome-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Downloaded",
      description: "Your data has been downloaded to your device",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Export Manager
          </CardTitle>
          <CardDescription>
            Export your health data for sharing or backup 📄
          </CardDescription>
        </CardHeader>
      </Card>

      {/* User Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={userInfo.age}
                onChange={(e) => setUserInfo(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Your age"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                value={userInfo.height}
                onChange={(e) => setUserInfo(prev => ({ ...prev, height: e.target.value }))}
                placeholder="Your height in cm"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                value={userInfo.weight}
                onChange={(e) => setUserInfo(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="Your weight in kg"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                className="shadow-soft focus:shadow-sakura transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              value={userInfo.medicalConditions}
              onChange={(e) => setUserInfo(prev => ({ ...prev, medicalConditions: e.target.value }))}
              placeholder="List any medical conditions, allergies, or relevant health information..."
              className="shadow-soft focus:shadow-sakura transition-shadow"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Date Range Selection */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Export Date Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal shadow-soft hover:shadow-sakura",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComp
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal shadow-soft hover:shadow-sakura",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComp
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={exportToPDF}
              variant="sakura"
              className="w-full h-20 flex flex-col items-center justify-center space-y-2"
            >
              <FileText className="h-6 w-6" />
              <span>Export to PDF</span>
            </Button>

            <Button
              onClick={exportToGmail}
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center space-y-2 shadow-soft hover:shadow-sakura"
            >
              <Mail className="h-6 w-6" />
              <span>Send via Gmail</span>
            </Button>

            <Button
              onClick={downloadToDevice}
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center space-y-2 shadow-soft hover:shadow-sakura"
            >
              <Download className="h-6 w-6" />
              <span>Download to Device</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="shadow-soft bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              <span className="text-sm">Food Logs</span>
            </div>
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              <span className="text-sm">Medications</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm">Health Metrics</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            All your tracked data will be included in the export
          </p>
        </CardContent>
      </Card>
    </div>
  );
}