import { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  userName?: string;
  onMenuToggle?: () => void;
  onNotificationsToggle?: () => void;
}

export function Header({ userName = "Guest", onMenuToggle, onNotificationsToggle }: HeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnreadCount = () => {
      const count = parseInt(localStorage.getItem('unreadNotificationCount') || '0');
      setUnreadCount(count);
    };

    updateUnreadCount();

    const handleNotificationsCleared = () => setUnreadCount(0);
    const handleNotificationsRead = () => setUnreadCount(0);

    window.addEventListener('notificationsCleared', handleNotificationsCleared);
    window.addEventListener('notificationsRead', handleNotificationsRead);

    return () => {
      window.removeEventListener('notificationsCleared', handleNotificationsCleared);
      window.removeEventListener('notificationsRead', handleNotificationsRead);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-soft z-50">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            {userName}'s Personal Assistant
          </h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationsToggle}
          className="hover:bg-primary/10 hover:text-primary relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}