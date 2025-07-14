import { useState } from "react";
import { User, Mail, Lock, Calendar, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ProfileProps {
  userData: any;
  onSignOut: () => void;
}

export function Profile({ userData, onSignOut }: ProfileProps) {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    fullName: userData?.fullName || '',
    email: userData?.email || '',
    gender: userData?.gender || '',
    dateOfBirth: userData?.dateOfBirth || null
  });

  const [notifications, setNotifications] = useState({
    birthdays: true,
    missedActivities: true,
    mealReminders: true,
    taskNudges: true
  });

  const handleSave = () => {
    // Save profile data to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile & Settings
          </CardTitle>
          <CardDescription>
            Manage your account and notification preferences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={profileData.fullName}
              onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
              className="shadow-soft focus:shadow-sakura transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="shadow-soft focus:shadow-sakura transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              value={profileData.gender}
              readOnly
              className="shadow-soft bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : ''}
              readOnly
              className="shadow-soft bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Birthday Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming birthdays</p>
            </div>
            <Switch
              checked={notifications.birthdays}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, birthdays: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Missed Activity Alerts</Label>
              <p className="text-sm text-muted-foreground">Reminders for incomplete tasks and logs</p>
            </div>
            <Switch
              checked={notifications.missedActivities}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, missedActivities: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Meal Medication Prompts</Label>
              <p className="text-sm text-muted-foreground">Reminders to take medications with meals</p>
            </div>
            <Switch
              checked={notifications.mealReminders}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, mealReminders: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Task Nudges</Label>
              <p className="text-sm text-muted-foreground">Gentle reminders about pending tasks</p>
            </div>
            <Switch
              checked={notifications.taskNudges}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, taskNudges: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          onClick={handleSave}
          variant="sakura" 
          className="w-full"
        >
          Save Settings
        </Button>

        <Separator />

        <Button 
          onClick={onSignOut}
          variant="outline" 
          className="w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}