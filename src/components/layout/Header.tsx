import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName?: string;
  onMenuToggle?: () => void;
  onNotificationsToggle?: () => void;
}

export function Header({ userName = "Guest", onMenuToggle, onNotificationsToggle }: HeaderProps) {
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
          {/* Notification dot */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-gentle-bounce" />
        </Button>
      </div>
    </header>
  );
}