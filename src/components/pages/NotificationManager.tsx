import { useState } from "react";
import { Bell, Settings, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function NotificationManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    birthdays: true,
    missedActivities: true,
    mealReminders: true,
    taskNudges: true,
    periodReminders: true,
    sugarBpReminders: false
  });

  const [notificationHistory] = useState([
    {
      id: '1',
      type: 'medication',
      title: 'Breakfast Medication',
      message: 'Time to take your Vitamin D3!',
      time: '2 hours ago',
      isRead: true
    },
    {
      id: '2', 
      type: 'task',
      title: 'Pending Tasks',
      message: 'You have 3 tasks remaining for today',
      time: '4 hours ago',
      isRead: true
    },
    {
      id: '3',
      type: 'diary',
      title: 'Diary Reminder',
      message: 'Don\'t forget to write in your diary today!',
      time: 'Yesterday',
      isRead: true
    }
  ]);

  const handleSaveSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('notificationHistory');
    toast({
      title: "History Cleared",
      description: "All notification history has been cleared.",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-soft shadow-sakura">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Manager
          </CardTitle>
          <CardDescription>
            Manage your notification preferences and history
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Birthday Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming birthdays</p>
            </div>
            <Switch
              checked={settings.birthdays}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, birthdays: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Missed Activity Alerts</Label>
              <p className="text-sm text-muted-foreground">Reminders for incomplete tasks and logs</p>
            </div>
            <Switch
              checked={settings.missedActivities}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, missedActivities: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Meal Medication Prompts</Label>
              <p className="text-sm text-muted-foreground">Reminders to take medications with meals</p>
            </div>
            <Switch
              checked={settings.mealReminders}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, mealReminders: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Task Nudges</Label>
              <p className="text-sm text-muted-foreground">Gentle reminders about pending tasks</p>
            </div>
            <Switch
              checked={settings.taskNudges}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, taskNudges: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Period Reminders</Label>
              <p className="text-sm text-muted-foreground">Notifications about upcoming periods</p>
            </div>
            <Switch
              checked={settings.periodReminders}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, periodReminders: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sugar & BP Reminders</Label>
              <p className="text-sm text-muted-foreground">Reminders to check blood sugar and pressure</p>
            </div>
            <Switch
              checked={settings.sugarBpReminders}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sugarBpReminders: checked }))}
            />
          </div>

          <Button onClick={handleSaveSettings} variant="sakura" className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notification History</CardTitle>
            <Button
              onClick={clearHistory}
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {notificationHistory.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notificationHistory.map((notification) => (
              <div
                key={notification.id}
                className="p-3 rounded-lg border bg-background"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {notification.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}