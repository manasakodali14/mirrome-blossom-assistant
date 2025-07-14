import { useState } from "react";
import { Bell, X, Calendar, AlertTriangle, Heart, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: "birthday" | "task" | "diary" | "medication" | "health";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "medication",
    title: "Breakfast Medication",
    message: "Don't forget to take your Vitamin D3!",
    time: "9:00 AM",
    isRead: false
  },
  {
    id: "2",
    type: "task",
    title: "Incomplete Tasks",
    message: "You have 2 tasks pending for today",
    time: "2 hours ago",
    isRead: false
  },
  {
    id: "3",
    type: "diary",
    title: "Diary Entry",
    message: "How are you feeling today? Write in your diary!",
    time: "Yesterday",
    isRead: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "birthday":
      return <Calendar className="h-4 w-4" />;
    case "task":
      return <AlertTriangle className="h-4 w-4" />;
    case "diary":
      return <Heart className="h-4 w-4" />;
    case "medication":
      return <Pill className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "birthday":
      return "text-yellow-500";
    case "task":
      return "text-orange-500";
    case "diary":
      return "text-pink-500";
    case "medication":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Notification Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="p-2 border-b border-border">
            <Button variant="ghost" size="sm" onClick={clearAll} className="w-full">
              Clear All
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-secondary",
                  notification.isRead ? "bg-background" : "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex gap-3">
                  <div className={cn("mt-1", getNotificationColor(notification.type))}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}